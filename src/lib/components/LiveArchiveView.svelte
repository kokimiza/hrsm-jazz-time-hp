<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { localePath } from '$lib/i18n';
	import type { LiveEntry } from '$lib/cms/types';

	let { lives, page, totalPages }: { lives: LiveEntry[]; page: number; totalPages: number } =
		$props();
</script>

<Container class="py-14 sm:py-20">
	<a href={localePath('/live')} class="mb-8 inline-block text-sm text-brand-ink hover:underline">
		← {m.live_archive_back()}
	</a>

	<header class="mb-10 max-w-2xl space-y-3">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.live_archive_heading()}
		</h1>
		<p class="text-ink-muted">{m.live_archive_lead()}</p>
	</header>

	<div class="max-w-2xl">
		<LiveCalendar {lives} emptyMessage={m.live_archive_empty} />
		<Pagination basePath="/live/archive" {page} {totalPages} />
	</div>
</Container>
