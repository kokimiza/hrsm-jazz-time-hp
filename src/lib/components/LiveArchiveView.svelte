<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { localePath } from '$lib/i18n';
	import { isUpcoming, today } from '$lib/stores/today.svelte';
	import type { LiveEntry } from '$lib/cms/types';

	let {
		lives,
		upcoming = [],
		page,
		totalPages
	}: {
		lives: LiveEntry[];
		/** ビルド時点で「今後」だったライブ（1ページ目だけ渡す）。閲覧時点で過ぎた分を先頭に足す。 */
		upcoming?: LiveEntry[];
		page: number;
		totalPages: number;
	} = $props();
</script>

<Container class="py-14 sm:py-20">
	<a href={localePath('/live')} class="mb-8 inline-block text-sm text-brand-ink hover:underline">
		← {m.live_archive_back()}
	</a>

	<header class="mb-10 max-w-2xl space-y-3">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.live_archive_heading()}
		</h1>
		<p class="text-base text-ink-muted">{m.live_archive_lead()}</p>
	</header>

	<div class="max-w-3xl">
		<!-- ビルド時点の過去分はそのまま正しいので、閲覧日が決まるまではそれを出しておく。
		     決まったら、ビルド後に過ぎた分を先頭に足す（upcoming は開催日昇順なので、新しい順に合わせて逆順にする）。 -->
		{#await today.date}
			<LiveCalendar {lives} emptyMessage={m.live_archive_empty} />
		{:then date}
			<LiveCalendar
				lives={[...upcoming.filter((live) => !isUpcoming(live, date)).reverse(), ...lives]}
				emptyMessage={m.live_archive_empty}
			/>
		{/await}
		<Pagination basePath="/live/archive" {page} {totalPages} />
	</div>
</Container>
