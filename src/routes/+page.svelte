<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextLink from '$lib/components/TextLink.svelte';
	import LiveCard from '$lib/components/LiveCard.svelte';
	import JournalCard from '$lib/components/JournalCard.svelte';
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
<section class="relative overflow-hidden bg-ink">
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

	<Container class="relative flex flex-col items-start gap-6 py-24 sm:py-32">
		<p class="font-display text-sm font-medium tracking-[0.3em] text-gold uppercase">
			{m.hero_kicker()}
		</p>
		<h1 class="font-display text-4xl leading-tight font-semibold text-white sm:text-6xl">
			{m.hero_headline_line1()}<br />
			{m.hero_headline_line2()}
		</h1>
		<p class="max-w-md text-base text-white/85 sm:text-lg">
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

<!-- Next Live -->
<section class="grain border-y border-border bg-surface">
	<Container class="py-16 sm:py-24">
		<h2 class="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
			{m.next_live_heading()}
		</h2>
		{#if data.nextLive}
			<div class="max-w-xl">
				<LiveCard live={data.nextLive} />
			</div>
		{:else}
			<p class="text-ink-muted">{m.next_live_empty()}</p>
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

<!-- Access excerpt -->
<!-- 他2つの抜粋（About/Journal）は見出し→本文→CTAの同じ順・同じ余白で並ぶため、ここだけ意図的に型を崩す。
     住所を主役にして見出しを下に添え、CTAも箱ボタンではなく矢印リンクにする＝「扉の脇に貼られた案内書き」のような、
     肩肘張らない締め方。ページ全体の抑揚として、最後のセクションだけ静かに終わる。 -->
<section>
	<Container class="border-t border-border py-10 sm:py-14">
		<div class="flex flex-col items-start gap-2">
			<p class="text-ink-muted">
				{m.address_line1()}
				{m.address_line2()}
			</p>
			<h2 class="font-display text-xl font-semibold text-ink sm:text-2xl">
				{m.home_access_heading()}
			</h2>
			<TextLink href={localePath('/access')} class="mt-2">{m.home_access_cta()}</TextLink>
		</div>
	</Container>
</section>
