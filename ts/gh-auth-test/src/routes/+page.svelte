<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	// signIn() -> run the logic to sign in user, signIn("github") -> use the sign in with github logic
	// signOut() -> run the logic to sign out user
	import { page } from '$app/stores';
	// $page.data.session -> { user, image, etc. } AUTH session
	console.log('$page.data.session = ' + $page.data.session);

	interface Follower {
		id: number;
		login: string;
		avatar_url: string;
		// Adicione outras propriedades que um seguidor possa ter
	}
	let followerList: Follower[] = [];

	async function getFollowerList() {
		await fetch('https://api.github.com/user/followers', {
			headers: {
				Accept: 'application/vnd.github+json',
				// @ts-expect-error: access_token not defined in session
				Authorization: 'Bearer ' + $page.data.session?.access_token,
				'X-GitHub-Api-Version': '2022-11-28'
			}
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				console.log(data); // [ user1, user2, user3 ]
				followerList = data;
			});
	}
	console.log(followerList);
</script>

<div class="p-24">
	{#if $page.data.session}
		<h1>You are logged in</h1>
		{#if $page.data.session.user?.image}
			<img src={$page.data.session.user.image} alt="User Profile" class="h-12 w-12" />
		{/if}
		<p>Signed in as {$page.data.session.user?.name}</p>
		<button on:click={() => signOut()} class="rounded bg-blue-500 px-2 py-1 font-bold text-white"
			>Sign Out</button
		>
		<button
			on:click={() => getFollowerList()}
			class="rounded bg-blue-800 px-2 py-1 font-bold text-white">Get Followers List</button
		>
		<ul class="w-96">
			{#each followerList as item, index (item.login)}
				<li id={'follower_' + index} class="w-64">{item.login}</li>
				<li id={'avatar_' + index} class="w-96">{item.avatar_url}</li>
			{/each}
		</ul>
	{:else}
		<h1>You are not logged in</h1>
		<button
			on:click={() => signIn('github')}
			class="rounded bg-blue-500 px-2 py-1 font-bold text-white">Sign in with GitHub</button
		>
	{/if}
</div>
