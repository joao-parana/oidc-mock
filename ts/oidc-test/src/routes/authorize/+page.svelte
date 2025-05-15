<script lang="ts">
	import { onMount } from 'svelte';
	// import { goto } from '$app/navigation';

	onMount(async () => {
		// Força o recarregamento para garantir o processamento do token
		// window.location.reload();
		console.log('onMount() called');
	});
</script>

<!-- src/routes/authorize/+page.svelte -->
// src/routes/authorize/+page.svelte

<div>Processando autenticação...</div>

<div class="loading-container">
	<div class="spinner"></div>
	<p>Autenticando...</p>
</div>

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.spinner {
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
