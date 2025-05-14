<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { keycloak } from '$lib/auth/keycloak';
	import { initializeKeycloak } from '$lib/auth/keycloak';
	import { onMount } from 'svelte';

	let authenticated = false;
	let userInfo: { username: string } | null = null;

	onMount(async () => {
		authenticated = await initializeKeycloak();
		if (authenticated) {
			userInfo = getUserInfo();
		}
	});
</script>

<nav>
	{#if authenticated}
		<span>Welcome, {userInfo?.username}</span>
		<button on:click={logout}>Logout</button>
	{:else}
		<button on:click={login}>Login</button>
	{/if}
</nav>

<slot />
