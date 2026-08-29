<script lang="ts">
	import { formatDate, formatDateParts } from '$lib/format';
	import type { Locale } from '$lib/paraglide/runtime';

	let { date, locale }: { date: string; locale: Locale } = $props();

	const parts = $derived(formatDateParts(date, locale));
</script>

<!-- 卓上カレンダーの1枚をめくったような「日付バッジ」。ライブ一覧・Next Liveで共通して使う。
     視覚的には月/日/曜日に分解しているが、スクリーンリーダーには完全な日付を1つの文として読ませる。 -->
<div
	class="flex w-16 shrink-0 flex-col items-center overflow-hidden rounded-xl border border-border bg-canvas"
	role="img"
	aria-label={formatDate(date, locale)}
>
	<div
		aria-hidden="true"
		class="relative w-full bg-brand py-1 text-center text-[16px] font-semibold tracking-widest text-white uppercase"
	>
		{parts.month}
		<!-- 月タブと日付面の継ぎ目に「ミシン目」を1本。切り離した卓上カレンダーの紙の質感を、
		     テーマ色に依存しない形（canvas色の穴あき）で表現する。 -->
		<span
			class="absolute inset-x-0 -bottom-0.75 h-1.5 bg-[radial-gradient(circle,var(--color-canvas)_1.6px,transparent_1.7px)] bg-size-[7px_7px] bg-position-[2.5px_center] bg-repeat-x"
		></span>
	</div>
	<div aria-hidden="true" class="flex flex-1 flex-col items-center justify-center gap-0.5 py-2">
		<span class="font-display text-2xl leading-none font-semibold text-ink">{parts.day}</span>
		<span class="text-[16px] text-ink-muted">{parts.weekday}</span>
	</div>
</div>
