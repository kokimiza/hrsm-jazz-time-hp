<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import { localePath } from '$lib/i18n';
	import ThemeToggle from './ThemeToggle.svelte';
	import PhoneLink from './PhoneLink.svelte';

	const navItems = [
		{ href: '/about', label: m.nav_about },
		{ href: '/journal', label: m.nav_journal },
		{ href: '/live', label: m.nav_live },
		{ href: '/access', label: m.nav_access }
	];

	function isActive(href: string) {
		// page.url はロケールprefix付き（/en/live等）なので、比較前にカノニカルなパスへ戻す
		const path = deLocalizeUrl(page.url).pathname;
		return path === href || path.startsWith(`${href}/`);
	}
</script>

<header
	class="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur supports-backdrop-filter:bg-canvas/85"
>
	<!-- ステージの緞帳のような、臙脂〜ゴールドの帯 -->
	<div class="h-0.75 bg-linear-to-r from-brand-deep via-brand to-gold"></div>

	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="flex items-center justify-between gap-4 py-5 sm:py-6">
			<a href={localePath('/')} class="flex flex-col leading-none">
				<span class="font-display text-2xl font-semibold tracking-wide text-brand sm:text-3xl">
					{m.site_name()}
				</span>
				<span
					class="mt-1.5 hidden text-[1.04rem] font-medium tracking-[0.35em] text-ink-muted uppercase sm:block"
				>
					{m.hero_kicker()}
				</span>
			</a>

			<div class="flex shrink-0 items-center gap-3 sm:gap-4">
				<PhoneLink
					class="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-ink hover:border-brand hover:text-brand md:inline-flex"
				/>
				<span class="hidden h-6 w-px bg-border md:block"></span>
				<ThemeToggle />
			</div>
		</div>

		<nav
			class="no-scrollbar flex items-center gap-7 overflow-x-auto border-t border-border py-3 text-sm font-medium tracking-wide whitespace-nowrap uppercase sm:justify-center sm:gap-12"
			aria-label={m.site_name()}
		>
			{#each navItems as item (item.href)}
				<a
					href={localePath(item.href)}
					class="border-b-2 pb-0.5 transition-colors hover:text-brand {isActive(item.href)
						? 'border-brand text-brand'
						: 'border-transparent text-ink-muted'}"
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					{item.label()}
				</a>
			{/each}
		</nav>
	</div>
</header>
