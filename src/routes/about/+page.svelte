<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Container from '$lib/components/Container.svelte';

	const features = [
		m.about_feature_1,
		m.about_feature_2,
		m.about_feature_3,
		m.about_feature_4,
		m.about_feature_5,
		m.about_feature_6
	];
</script>

<svelte:head>
	<title>{m.about_page_heading()} | {m.site_name()}</title>
</svelte:head>

<Container class="py-14 sm:py-20">
	<header class="max-w-2xl space-y-4">
		<h1 class="font-display text-3xl font-semibold text-ink sm:text-4xl">
			{m.about_page_heading()}
		</h1>
		<p class="font-display text-xl text-gold">{m.about_lead()}</p>
		<p class="leading-relaxed text-base text-ink-muted">{m.about_body()}</p>
	</header>

	<section class="mt-14">
		<h2 class="mb-6 font-display text-xl font-semibold text-ink">
			{m.about_features_heading()}
		</h2>
		<ul class="grid gap-3 sm:grid-cols-2">
			{#each features as feature (feature)}
				<li class="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
					<span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"></span>
					<span class="text-ink">{feature()}</span>
				</li>
			{/each}
		</ul>
	</section>
</Container>
