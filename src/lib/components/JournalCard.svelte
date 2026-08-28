<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate } from '$lib/format';
	import { urlFor } from '$lib/cms/image';
	import { localePath } from '$lib/i18n';
	import ArrowIcon from './ArrowIcon.svelte';
	import type { JournalListEntry } from '$lib/cms/types';

	let { entry }: { entry: JournalListEntry } = $props();

	const locale = getLocale();
	const cover = $derived(urlFor(entry.coverImage, 800));
</script>

<a
	href={localePath(`/journal/${entry.slug}`)}
	class="grain group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg"
>
	<div class="aspect-[16/10] overflow-hidden bg-canvas">
		{#if cover}
			<img
				src={cover}
				alt="ブログカバー"
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		{/if}
	</div>
	<div class="flex flex-1 flex-col gap-2 p-5">
		<p class="text-xs text-ink-muted">{formatDate(entry.publishedAt, locale)}</p>
		<h3 class="font-display text-lg font-semibold text-ink">{entry.title}</h3>
		<span class="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-brand">
			<span class="border-b border-transparent group-hover:border-current"
				>{m.journal_read_more()}</span
			>
			<ArrowIcon class="transition-transform duration-200 ease-out group-hover:translate-x-1" />
		</span>
	</div>
</a>
