<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import LiveDateBadge from './LiveDateBadge.svelte';
	import PerformerList from './PerformerList.svelte';
	import type { LiveEntry } from '$lib/cms/types';

	let { live }: { live: LiveEntry } = $props();
	const locale = getLocale();
</script>

<!-- Home「次回のライブ」用のスポットライトカード。/live の日付バッジ・出演者表記と見た目を揃える。 -->
<article class="grain flex gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
	<LiveDateBadge date={live.date} {locale} />
	<div class="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
		<PerformerList performers={live.performers} />
		{#if live.note}
			<p class="text-sm whitespace-pre-line text-ink-muted">
				<span class="sr-only">{m.live_note_label()}: </span>{live.note}
			</p>
		{/if}
	</div>
</article>
