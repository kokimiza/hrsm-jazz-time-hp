<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { Performer } from '$lib/cms/types';

	let { performers }: { performers: Performer[] } = $props();
</script>

<!-- 出演者は「名前（楽器）」のただのテキスト。名前を大きめ・濃い色で主役にし、
     楽器は括弧つきの補助表記に留める（小さな色つきバッジは読みにくいので使わない）。 -->
<p class="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-lg">
	<span class="sr-only">{m.live_performers_label()}: </span>
	{#each performers as performer, i (performer.name + i)}
		<!-- 名前と楽器を1つの塊にして、折り返し時に楽器名だけ単独で次の行に落ちないようにする -->
		<span class="inline-flex items-baseline">
			<span class="font-medium text-ink">{performer.name}</span>
			{#if performer.instrument}
				<span class="text-base text-ink-muted">（{performer.instrument}）</span>
			{/if}
		</span>
		{#if i < performers.length - 1}
			<span class="text-ink-muted" aria-hidden="true">／</span>
		{/if}
	{/each}
</p>
