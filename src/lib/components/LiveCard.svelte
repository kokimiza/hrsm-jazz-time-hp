<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate } from '$lib/format';
	import type { LiveEntry } from '$lib/cms/types';

	let { live }: { live: LiveEntry } = $props();
</script>

<article class="live">
	<time datetime={live.date}>{formatDate(live.date, getLocale())}</time>
	{#if live.closed}
		<p>{m.live_closed_label()}</p>
	{/if}
	{#if live.note}
		<p>{live.note}</p>
	{/if}
</article>

<style>
	.live {
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-gold);
	}

	time {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 500;
		letter-spacing: 0.04em;
	}

	p {
		margin-top: 0.75rem;
		line-height: 1.9;
		color: var(--color-ink-muted);
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
</style>
