<!-- src/routes/protected/+page.svelte -->
<script lang="ts">
	import { keycloak } from '$lib/auth/keycloak';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!keycloak.authenticated) {
			keycloak.login();
		}
	});
</script>

<h1>Protected Content</h1>
<p>This content is only visible to authenticated users</p>
