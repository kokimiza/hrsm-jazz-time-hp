<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate, formatDateParts, formatMonthHeading, monthKey } from '$lib/format';
	import PerformerList from './PerformerList.svelte';
	import type { LiveEntry } from '$lib/cms/types';

	let {
		lives,
		emptyMessage = m.next_live_empty
	}: { lives: LiveEntry[]; emptyMessage?: () => string } = $props();
	const locale = getLocale();

	// 日付順（呼び出し側で開催日昇順ソート済み）のまま、月ごとにグルーピングする。
	const groups = $derived.by(() => {
		const result: { key: string; heading: string; lives: LiveEntry[] }[] = [];
		for (const live of lives) {
			const key = monthKey(live.date);
			const last = result.at(-1);
			if (last?.key === key) {
				last.lives.push(live);
			} else {
				result.push({ key, heading: formatMonthHeading(live.date, locale), lives: [live] });
			}
		}
		return result;
	});

	/** 日付欄の文字色。土=青／日=赤という紙のカレンダーの手がかりを残し、店休日は落ち着いた色にする。 */
	function dateTone(weekdayIndex: number, closed: boolean | undefined): string {
		if (closed) return 'text-ink-muted';
		if (weekdayIndex === 0) return 'text-sun';
		if (weekdayIndex === 6) return 'text-sat';
		return 'text-ink';
	}
</script>

<!-- ライブ予定表。装飾を足すより「日付」と「誰が出るか」が一目で追えることを優先し、
     月ごとの表を罫線1本で区切るだけの素朴な作りにしている。
     主な来店客層（60代以上）を考えて、文字は大きめ・色数は最小限・淡いグレーアウトは使わない。 -->
{#if lives.length}
	<div class="space-y-12">
		{#each groups as group (group.key)}
			<section>
				<h2 class="font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
					{group.heading}
				</h2>
				<!-- 表の天は月見出しを受ける太い罫（border-collapseで1行目の細罫と重なり、太い方が残る）。
				     行間の罫は既定のborder色だと地に埋もれて表として読めないので、
				     地の濃さに追従する ink-muted の薄めで、細くてもはっきり見える線にする。 -->
				<table class="mt-3 w-full border-collapse border-t-2 border-brand-ink/70 text-left">
					<caption class="sr-only">{group.heading}</caption>
					<tbody>
						{#each group.lives as live (live._id)}
							{@const parts = formatDateParts(live.date, locale)}
							<tr class="border-t border-ink-muted/40 last:border-b">
								<!-- 日付は行見出し。画面では「日＋曜日」だけを大きく出し、
								     読み上げには年月日を含む完全な日付を渡す。 -->
								<th
									scope="row"
									class="w-22 py-5 pr-4 align-baseline font-normal whitespace-nowrap sm:w-28 sm:pr-8"
								>
									<span class="sr-only">{formatDate(live.date, locale)}</span>
									<span aria-hidden="true" class={dateTone(parts.weekdayIndex, live.closed)}>
										<span class="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
											{parts.day}
										</span>
										<span class="ml-1 text-base">{parts.weekday}</span>
									</span>
								</th>
								<td class="py-5 align-baseline">
									{#if live.closed}
										<p class="text-lg text-ink-muted">{m.live_closed_label()}</p>
									{:else}
										<PerformerList performers={live.performers} />
									{/if}
									{#if live.note}
										<p class="mt-1.5 text-base whitespace-pre-line text-ink-muted">
											<span class="sr-only">{m.live_note_label()}: </span>{live.note}
										</p>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
		{/each}
	</div>
{:else}
	<p class="text-base text-ink-muted">{emptyMessage()}</p>
{/if}
