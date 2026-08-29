<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatMonthHeading, monthKey } from '$lib/format';
	import LiveDateBadge from './LiveDateBadge.svelte';
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
</script>

{#if lives.length}
	<div class="grain divide-y divide-border rounded-2xl border border-border bg-surface">
		{#each groups as group (group.key)}
			<section class="px-5 py-6 sm:px-8">
				<h2 class="mb-4 font-display text-lg font-semibold text-brand-ink sm:text-xl">
					{group.heading}
				</h2>
				<ul class="divide-y divide-border/70">
					{#each group.lives as live (live._id)}
						<!-- 店休日はグレーアウト（バッジは破線・淡色、行全体も少し透過）して、
						     出演リストの代わりに「店休」ラベルだけを出す。 -->
						<li class="flex gap-4 py-4 first:pt-0 last:pb-0" class:opacity-60={live.closed}>
							<LiveDateBadge date={live.date} {locale} closed={live.closed} />
							<div class="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
								{#if live.closed}
									<p class="font-medium text-ink-muted">{m.live_closed_label()}</p>
								{:else}
									<PerformerList performers={live.performers} />
								{/if}
								{#if live.note}
									<p class="text-sm whitespace-pre-line text-ink-muted">
										<span class="sr-only">{m.live_note_label()}: </span>{live.note}
									</p>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
{:else}
	<p class="text-ink-muted">{emptyMessage()}</p>
{/if}
