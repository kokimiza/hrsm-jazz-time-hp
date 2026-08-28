<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import PhoneLink from '$lib/components/PhoneLink.svelte';
	import TextLink from '$lib/components/TextLink.svelte';
	import { localePath } from '$lib/i18n';

	// 簡易的な地図埋め込み（APIキー不要）。本番運用ではGoogle Maps Embed APIへの切替を推奨。
	const mapQuery = encodeURIComponent('広島県広島市中区流川町2-24 蔵ビル4F JAZZTIME');
	const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
</script>

<svelte:head>
	<title>{m.access_page_heading()} | {m.site_name()}</title>
</svelte:head>

<Container class="py-14 sm:py-20">
	<h1 class="mb-10 font-display text-3xl font-semibold text-ink sm:text-4xl">
		{m.access_page_heading()}
	</h1>

	<div class="grid gap-10 md:grid-cols-2">
		<div class="space-y-8">
			<div>
				<h2 class="mb-1 text-sm font-medium text-ink-muted">{m.access_shop_name()}</h2>
				<p class="font-display text-2xl font-semibold text-ink">{m.site_name()}</p>
			</div>

			<div>
				<h2 class="mb-1 text-sm font-medium text-ink-muted">{m.access_address_heading()}</h2>
				<p class="text-ink">
					{m.address_line1()}<br />
					{m.address_line2()}
				</p>
			</div>

			<div>
				<h2 class="mb-1 text-sm font-medium text-ink-muted">{m.access_phone_heading()}</h2>
				<PhoneLink
					class="inline-flex items-center gap-2 text-lg text-brand-ink hover:text-brand-ink-hover"
				/>
			</div>

			<div>
				<h2 class="mb-1 text-sm font-medium text-ink-muted">{m.access_hours_heading()}</h2>
				<p class="mb-1 text-ink-muted">{m.access_hours_body()}</p>
				<TextLink href={localePath('/about')}>{m.about_page_heading()}</TextLink>
			</div>
		</div>

		<div class="overflow-hidden rounded-2xl border border-border bg-surface">
			<iframe
				title={m.access_map_heading()}
				src={mapSrc}
				class="h-80 w-full md:h-full md:min-h-[24rem]"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</div>
</Container>
