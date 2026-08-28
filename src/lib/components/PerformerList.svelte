<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { Performer } from '$lib/cms/types';

	let { performers }: { performers: Performer[] } = $props();
</script>

<!-- 「名前（楽器）」を並べる。楽器は名前より控えめな濃さにして、名前を主役にする。 -->
<p class="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
	<span class="sr-only">{m.live_performers_label()}: </span>
	{#each performers as performer, i (performer.name + i)}
		<span class="font-medium text-ink">{performer.name}</span>
		{#if performer.instrument}
			<span class="text-sm text-ink-muted">（{performer.instrument}）</span>
		{/if}
		{#if i < performers.length - 1}
			<span class="text-ink-muted" aria-hidden="true">／</span>
		{/if}
	{/each}
</p>
