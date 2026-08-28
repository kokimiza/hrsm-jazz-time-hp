<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import LiveCard from '$lib/components/LiveCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.live_page_heading()} | {m.site_name()}</title>
</svelte:head>

<Container class="py-14 sm:py-20">
	<header class="mb-10 max-w-2xl space-y-3">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.live_page_heading()}
		</h1>
		<p class="text-ink-muted">{m.live_page_lead()}</p>
	</header>

	{#if data.lives.length}
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.lives as live (live._id)}
				<LiveCard {live} />
			{/each}
		</div>
	{:else}
		<p class="text-ink-muted">{m.next_live_empty()}</p>
	{/if}
</Container>
