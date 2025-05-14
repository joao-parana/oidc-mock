<!--
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
-->

<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { keycloak } from '$lib/auth/keycloak';
</script>

<h1>Hello World</h1>

{#if keycloak.authenticated}
	<p>You are logged in!</p>
	<a href="/protected">Go to protected page</a>
{:else}
	<p>Please log in to access protected content</p>
{/if}
