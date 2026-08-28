<script lang="ts">
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
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !isHome}
	<AmbientBackground />
{/if}

<div class="flex min-h-dvh flex-col pb-16 md:pb-0">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
	<MobileQuickBar />
</div>
