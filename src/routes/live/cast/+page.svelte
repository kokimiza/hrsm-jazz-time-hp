<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import { urlFor } from '$lib/cms/image';
	import { localePath } from '$lib/i18n';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.cast_page_heading()} | {m.site_name()}</title>
</svelte:head>

<Container class="py-14 sm:py-20">
	<a href={localePath('/live')} class="mb-8 inline-block text-sm text-brand hover:underline">
		← {m.live_archive_back()}
	</a>

	<header class="mb-10 max-w-2xl space-y-3">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.cast_page_heading()}
		</h1>
		<p class="text-ink-muted">{m.cast_page_lead()}</p>
	</header>

	{#if data.cast.length}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.cast as member (member._id)}
				<article
					class="grain flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center"
				>
					{#if urlFor(member.icon, 200)}
						<img src={urlFor(member.icon, 200)} alt="" class="size-20 rounded-full object-cover" />
					{:else}
						<div
							class="flex size-20 items-center justify-center rounded-full bg-canvas font-display text-2xl text-ink-muted"
						>
							{member.name.slice(0, 1)}
						</div>
					{/if}
					<h2 class="font-display text-lg font-semibold text-ink">{member.name}</h2>
					{#if member.bio}
						<p class="text-sm text-ink-muted">{member.bio}</p>
					{/if}
				</article>
			{/each}
		</div>
	{:else}
		<p class="text-ink-muted">{m.cast_empty()}</p>
	{/if}
</Container>
