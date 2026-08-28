<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';

	// LP的な打ち出し（コンセプト文・特徴一覧）はやめ、来店前に確認しておきたい
	// 店のルールだけを1つの表にまとめる（ピル型ラベル＋大きい営業時間、という凝った構成は
	// 「わかりにくい」とのことでやめ、素直な表形式に一本化した）。
	const rows = [
		{ label: m.about_hours_label, value: m.about_hours_value, note: m.about_hours_note },
		{ label: m.about_sets_label, value: m.about_sets_value, note: m.about_sets_note },
		{ label: m.about_payment_label, value: m.about_payment_value, note: m.about_payment_note },
		{ label: m.about_closed_label, value: m.about_closed_value },
		{ label: m.about_session_label, value: m.about_session_value }
	];
</script>

<svelte:head>
	<title>{m.about_page_heading()} | {m.site_name()}</title>
</svelte:head>

<Container class="py-14 sm:py-20">
	<header class="mx-auto max-w-xl space-y-3 text-center">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.about_page_heading()}
		</h1>
		<p class="text-ink-muted">{m.about_lead()}</p>
	</header>

	<div class="grain mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border border-border">
		<table class="w-full border-collapse">
			<tbody class="divide-y divide-border">
				{#each rows as row (row.label)}
					<tr>
						<th
							scope="row"
							class="w-32 bg-surface px-4 py-4 text-left align-top text-sm font-medium text-ink-muted sm:w-40 sm:px-6"
						>
							{row.label()}
						</th>
						<td class="px-4 py-4 align-top text-ink sm:px-6">
							{row.value()}
							{#if row.note}
								<br />
								<span class="text-sm text-ink-muted">{row.note()}</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Container>
