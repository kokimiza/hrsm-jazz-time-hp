<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate } from '$lib/format';
	import PerformerList from './PerformerList.svelte';
	import type { LiveEntry } from '$lib/cms/types';

	let { live }: { live: LiveEntry } = $props();
	const locale = getLocale();
</script>

<!-- Home「次回のライブ」用のスポットライトカード。日付を大きな見出しに、出演者をその下に置く
     （/live のライブ予定表と同じ「日付が先、出演者が続く」読み順に揃えている）。 -->
<article class="grain rounded-2xl border border-border bg-surface p-6 sm:p-8">
	<p class="font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
		{formatDate(live.date, locale)}
	</p>
	<div class="mt-4">
		<PerformerList performers={live.performers} />
		{#if live.note}
			<p class="mt-1.5 text-base whitespace-pre-line text-ink-muted">
				<span class="sr-only">{m.live_note_label()}: </span>{live.note}
			</p>
		{/if}
	</div>
</article>
