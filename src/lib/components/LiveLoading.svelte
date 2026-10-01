<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let { variant }: { variant: 'card' | 'calendar' } = $props();

	const bar = 'animate-pulse rounded bg-ink-muted/20 motion-reduce:animate-none';
</script>

<!-- 閲覧時点の日付が決まるまでの仮表示（$lib/stores/today.svelte.ts）。プリレンダーされたHTMLにはこれが入る。
     本物（LiveCard / LiveCalendar）と同じ罫線・余白にして、差し替わったときに画面が跳ねないようにする。 -->
<div role="status">
	<span class="sr-only">{m.live_loading()}</span>
	{#if variant === 'card'}
		<div aria-hidden="true" class="border-t border-gold pt-6">
			<div class="{bar} h-9 w-64 max-w-full"></div>
		</div>
	{:else}
		<div aria-hidden="true">
			<div class="{bar} h-8 w-40 sm:h-9"></div>
			<div class="mt-3 border-t-2 border-brand-ink/70">
				{#each ['w-48', 'w-64', 'w-40', 'w-56'] as width (width)}
					<div class="flex items-center border-t border-ink-muted/40 py-5 last:border-b">
						<div class="w-22 pr-4 sm:w-28 sm:pr-8"><div class="{bar} h-8 w-14"></div></div>
						<div class="{bar} h-7 {width} max-w-full"></div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
