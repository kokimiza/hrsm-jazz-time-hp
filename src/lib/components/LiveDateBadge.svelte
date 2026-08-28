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
		class="w-full bg-brand py-1 text-center text-[16px] font-semibold tracking-widest text-white uppercase"
	>
		{parts.month}
	</div>
	<div aria-hidden="true" class="flex flex-1 flex-col items-center justify-center gap-0.5 py-2">
		<span class="font-display text-2xl leading-none font-semibold text-ink">{parts.day}</span>
		<span class="text-[16px] text-ink-muted">{parts.weekday}</span>
	</div>
</div>
