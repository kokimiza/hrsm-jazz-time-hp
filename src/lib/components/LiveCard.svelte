<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate } from '$lib/format';
	import type { LiveEntry } from '$lib/cms/types';

	let { live }: { live: LiveEntry } = $props();
</script>

<article class="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:p-6">
	<p class="font-display text-lg font-semibold text-brand sm:text-xl">
		{formatDate(live.date, getLocale())}
	</p>

	{#if live.openTime || live.startTime}
		<p class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
			{#if live.openTime}
				<span>{m.live_open_label()} {live.openTime}</span>
			{/if}
			{#if live.startTime}
				<span>{m.live_start_label()} {live.startTime}</span>
			{/if}
		</p>
	{/if}

	{#if live.performers?.length}
		<p class="text-ink">
			<span class="mr-2 text-sm text-ink-muted">{m.live_performers_label()}</span>
			{live.performers.join(' / ')}
		</p>
	{/if}
</article>
