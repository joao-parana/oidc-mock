<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { keycloak } from '$lib/auth/keycloak';
	import { onMount } from 'svelte';

	let authenticated = false;
	let userInfo: { username?: string } = {};

	onMount(async () => {
		authenticated = await keycloak.init({
			onLoad: 'check-sso',
			pkceMethod: 'S256'
		});

		if (authenticated) {
			userInfo = {
				username: keycloak.tokenParsed?.preferred_username
			};
		}
	});

	function login() {
		keycloak.login({
			redirectUri: 'http://localhost:8094/authorize/'
		});
	}

	function logout() {
		keycloak.logout({
			redirectUri: 'http://localhost:8094'
		});
	}
</script>

<nav>
	{#if authenticated}
		<span>Welcome, {userInfo.username}</span>
		<button on:click={logout}>Logout</button>
	{:else}
		<button on:click={login}>Login</button>
	{/if}
</nav>

<slot />
