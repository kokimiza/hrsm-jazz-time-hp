<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import JournalCard from '$lib/components/JournalCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.journal_page_heading()} | {m.site_name()}</title>
</svelte:head>

<Container class="py-14 sm:py-20">
	<header class="mb-10 max-w-2xl space-y-3">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.journal_page_heading()}
		</h1>
		<p class="text-ink-muted">{m.journal_page_lead()}</p>
	</header>

	{#if data.entries.length}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.entries as entry (entry._id)}
				<JournalCard {entry} />
			{/each}
		</div>
	{:else}
		<p class="text-ink-muted">{m.journal_empty()}</p>
	{/if}
</Container>
