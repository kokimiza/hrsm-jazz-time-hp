<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { deLocalizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MobileQuickBar from '$lib/components/MobileQuickBar.svelte';
	import AmbientBackground from '$lib/components/AmbientBackground.svelte';

	let { children } = $props();

	// Home（Heroに主役の店内写真がある）以外では、うっすら背景に写真を残す。
	const isHome = $derived(deLocalizeHref(page.url.pathname) === '/');
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<meta name="description" content={m.site_description()} />
	<meta name="theme-color" content="#201a16" />
</svelte:head>

{#if !isHome}
	<AmbientBackground />
{/if}

<a href="#main-content" class="skip-link">{m.skip_content()}</a>

<div class="flex min-h-dvh flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
	<Header />
	<main id="main-content" tabindex="-1" class="flex-1">
		{@render children()}
	</main>
	<Footer />
	<MobileQuickBar />
</div>
