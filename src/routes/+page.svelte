<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextLink from '$lib/components/TextLink.svelte';
	import LiveCard from '$lib/components/LiveCard.svelte';
	import JournalCard from '$lib/components/JournalCard.svelte';
	import PhoneLink from '$lib/components/PhoneLink.svelte';
	import MasterProfile from '$lib/components/MasterProfile.svelte';
	import { localePath } from '$lib/i18n';
	// 元写真(jazztime-interior.png, 4000x3000/7.5MB)はモバイルファーストの表示コストには重すぎるため、
	// リサイズ・WebP圧縮したものをヒーローに使う（元ファイルはsrc/lib/assetsにそのまま残してある）。
	import hero1200 from '$lib/assets/jazztime-interior-1200.webp';
	import hero2400 from '$lib/assets/jazztime-interior-2400.webp';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.site_name_full()}</title>
</svelte:head>

<!-- Hero -->
<section class="home-hero relative overflow-hidden bg-ink">
	<img
		src={hero2400}
		srcset={`${hero1200} 1200w, ${hero2400} 2400w`}
		sizes="100vw"
		alt=""
		class="absolute inset-0 h-full w-full object-cover"
		fetchpriority="high"
	/>
	<!-- 写真の上でも文字が読めるよう常時暗めのグラデーションを重ねる（テーマに関わらず固定） -->
	<div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/55 to-black/25"></div>

	<Container
		class="relative flex min-h-128 flex-col items-start justify-center gap-6 py-20 sm:min-h-160 sm:py-24"
	>
		<p class="font-display text-sm font-medium tracking-[0.3em] text-gold uppercase">
			{m.hero_kicker()}
		</p>
		<h1 class="hero-title font-display font-semibold text-white">
			{m.hero_headline_line1()}<br />
			{m.hero_headline_line2()}
		</h1>
		<p class="max-w-2xl text-base leading-relaxed text-white/85">
			{m.hero_lead()}
		</p>
		<div class="flex flex-wrap gap-3 pt-2">
			<Button href={localePath('/live')} variant="primary">{m.hero_cta_live()}</Button>
			<Button
				href={localePath('/access')}
				variant="secondary"
				class="border-white/60 text-white hover:border-white hover:text-white"
			>
				{m.hero_cta_access()}
			</Button>
		</div>
	</Container>
</section>

<!-- Essential visit information, using the same content as the guide. -->
<section class="border-b border-border bg-surface">
	<Container>
		<dl
			class="visit-facts grid divide-y divide-border py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
		>
			<div class="py-4 sm:pr-6">
				<dt>{m.about_hours_label()}</dt>
				<dd>{m.about_hours_value()}<span>{m.about_hours_note()}</span></dd>
			</div>
			<div class="py-4 sm:px-6">
				<dt>{m.about_closed_label()}</dt>
				<dd>{m.about_closed_value()}</dd>
			</div>
			<div class="py-4 sm:pl-6">
				<dt>{m.access_address_heading()}</dt>
				<dd>
					<a
						class="underline decoration-border underline-offset-4 hover:decoration-current"
						href={localePath('/access')}>{m.address_line1()}<span>{m.address_line2()}</span></a
					>
				</dd>
			</div>
		</dl>
	</Container>
</section>

<!-- Next Live -->
<section class="grain border-y border-border bg-surface">
	<Container class="py-16 sm:py-24">
		<div class="mb-8 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="section-kicker">LIVE MUSIC</p>
				<h2 class="font-display text-2xl font-semibold text-ink sm:text-3xl">
					{m.next_live_heading()}
				</h2>
			</div>
			<TextLink href={localePath('/live')}>{m.hero_cta_live()}</TextLink>
		</div>
		{#if data.nextLive}
			<div class="max-w-3xl">
				<LiveCard live={data.nextLive} />
			</div>
		{:else}
			<div class="rounded-2xl border border-border p-6 sm:p-8">
				<p class="max-w-2xl leading-relaxed text-ink-muted">{m.next_live_empty()}</p>
				<PhoneLink
					class="mt-5 inline-flex items-center gap-2 text-brand-ink underline underline-offset-4"
				/>
			</div>
		{/if}
	</Container>
</section>

<!-- About excerpt -->
<section>
	<Container class="grid gap-8 py-14 sm:py-20 md:grid-cols-[2fr_1fr] md:items-end">
		<div class="space-y-4">
			<h2 class="font-display text-2xl font-semibold text-ink sm:text-3xl">
				{m.home_about_heading()}
			</h2>
			<p class="max-w-2xl text-base leading-relaxed text-ink-muted">
				{m.home_about_body()}
			</p>
		</div>
		<TextLink href={localePath('/about')} class="md:justify-self-end">
			{m.home_about_cta()}
		</TextLink>
	</Container>
</section>

<!-- Master -->
<section>
	<Container class="py-14 sm:py-20">
		<h2 class="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
			{m.home_master_heading()}
		</h2>
		<MasterProfile />
	</Container>
</section>

<!-- Latest Journal -->
{#if data.journalEntries.length}
	<section class="grain border-y border-border bg-surface">
		<Container class="py-14 sm:py-20">
			<div class="mb-8 flex items-end justify-between gap-4">
				<h2 class="font-display text-2xl font-semibold text-ink sm:text-3xl">
					{m.home_journal_heading()}
				</h2>
				<TextLink href={localePath('/journal')}>{m.home_journal_cta()}</TextLink>
			</div>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.journalEntries as entry (entry._id)}
					<JournalCard {entry} />
				{/each}
			</div>
		</Container>
	</section>
{/if}

<!-- Visit -->
<section class="border-t border-border">
	<Container class="grid gap-8 py-14 sm:py-20 md:grid-cols-[1.3fr_1fr] md:items-center">
		<div>
			<p class="section-kicker">VISIT JAZZTIME</p>
			<h2 class="font-display text-2xl font-semibold sm:text-3xl">{m.visit_heading()}</h2>
			<p class="mt-5 leading-relaxed text-ink-muted">
				{m.address_line1()}<br />{m.address_line2()}
			</p>
			<TextLink href={localePath('/access')} class="mt-5">{m.home_access_cta()}</TextLink>
		</div>
		<div class="rounded-2xl border border-border bg-surface p-6 sm:p-8">
			<p class="mb-3 text-sm text-ink-muted">{m.visit_contact()}</p>
			<PhoneLink
				class="inline-flex items-center gap-3 font-display text-2xl font-semibold text-brand-ink"
			/>
			<p class="mt-3 text-sm text-ink-muted">{m.about_hours_value()} / {m.about_closed_value()}</p>
		</div>
	</Container>
</section>
