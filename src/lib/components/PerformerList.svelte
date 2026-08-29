<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { Performer } from '$lib/cms/types';

	let { performers }: { performers: Performer[] } = $props();
</script>

<!-- 名前＋楽器バッジを並べる。名前は主役として太字、楽器はゴールドの縁取りバッジで控えめに添える。 -->
<p class="flex flex-wrap items-center gap-x-2 gap-y-1.5">
	<span class="sr-only">{m.live_performers_label()}: </span>
	{#each performers as performer, i (performer.name + i)}
		<!-- 名前とバッジを1つの塊にして、折り返し時にバッジだけ単独で次の行に落ちないようにする -->
		<span class="inline-flex items-center gap-1.5">
			<span class="font-medium text-ink">{performer.name}</span>
			{#if performer.instrument}
				<span
					class="inline-flex items-center rounded-full border border-gold/40 px-2 py-0.5 text-xs leading-none font-medium tracking-wide text-gold uppercase"
				>
					{performer.instrument}
				</span>
			{/if}
		</span>
		{#if i < performers.length - 1}
			<span class="text-ink-muted" aria-hidden="true">／</span>
		{/if}
	{/each}
</p>
