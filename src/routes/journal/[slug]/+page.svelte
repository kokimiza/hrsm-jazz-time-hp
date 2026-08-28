<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate } from '$lib/format';
	import { pickLocale, pickLocaleBlocks } from '$lib/cms/localize';
	import { urlFor } from '$lib/cms/image';
	import { localePath } from '$lib/i18n';
	import Container from '$lib/components/Container.svelte';

	let { data } = $props();
	const locale = getLocale();

	const title = $derived(pickLocale(data.entry.title, locale));
	const excerpt = $derived(pickLocale(data.entry.excerpt, locale));
	const body = $derived(pickLocaleBlocks(data.entry.body, locale));
	const cover = $derived(urlFor(data.entry.coverImage, 1600));
</script>

<svelte:head>
	<title>{title} | {m.site_name()}</title>
	{#if excerpt}<meta name="description" content={excerpt} />{/if}
</svelte:head>

<article class="py-14 sm:py-20">
	<Container class="max-w-3xl">
		<a href={localePath('/journal')} class="mb-8 inline-block text-sm text-brand hover:underline">
			← {m.journal_back_to_list()}
		</a>

		<header class="mb-8 space-y-3">
			<p class="text-sm text-ink-muted">{formatDate(data.entry.publishedAt, locale)}</p>
			<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
		</header>

		{#if cover}
			<img src={cover} alt="" class="mb-10 aspect-[16/9] w-full rounded-2xl object-cover" />
		{/if}

		<div class="prose max-w-none prose-neutral dark:prose-invert prose-headings:font-display">
			<PortableText value={body} />
		</div>
	</Container>
</article>
