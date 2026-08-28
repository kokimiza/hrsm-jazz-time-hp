<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate } from '$lib/format';
	import { pickLocale } from '$lib/cms/localize';
	import { urlFor } from '$lib/cms/image';
	import { localePath } from '$lib/i18n';
	import type { JournalListEntry } from '$lib/cms/types';

	let { entry }: { entry: JournalListEntry } = $props();

	const locale = getLocale();
	const cover = $derived(urlFor(entry.coverImage, 800));
</script>

<a
	href={localePath(`/journal/${entry.slug}`)}
	class="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg"
>
	<div class="aspect-[16/10] overflow-hidden bg-canvas">
		{#if cover}
			<img
				src={cover}
				alt=""
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		{/if}
	</div>
	<div class="flex flex-1 flex-col gap-2 p-5">
		<p class="text-xs text-ink-muted">{formatDate(entry.publishedAt, locale)}</p>
		<h3 class="font-display text-lg font-semibold text-ink">{pickLocale(entry.title, locale)}</h3>
		{#if entry.excerpt}
			<p class="line-clamp-2 text-sm text-ink-muted">{pickLocale(entry.excerpt, locale)}</p>
		{/if}
		<span class="mt-auto pt-2 text-sm font-medium text-brand">{m.journal_read_more()} →</span>
	</div>
</a>
