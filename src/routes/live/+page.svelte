<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import LiveCalendar from '$lib/components/LiveCalendar.svelte';
	import TextLink from '$lib/components/TextLink.svelte';
	import { localePath } from '$lib/i18n';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.live_page_heading()} | {m.site_name()}</title>
</svelte:head>

<Container class="py-14 sm:py-20">
	<header class="mb-10 max-w-2xl space-y-3">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.live_page_heading()}
		</h1>
		<p class="text-ink-muted">{m.live_page_lead()}</p>
	</header>

	<div class="max-w-2xl">
		<LiveCalendar lives={data.lives} />

		<p class="mt-8">
			<TextLink href={localePath('/live/archive')}>{m.live_archive_cta()}</TextLink>
		</p>
	</div>
</Container>
