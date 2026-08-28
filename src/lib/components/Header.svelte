<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import { localePath } from '$lib/i18n';
	import ThemeToggle from './ThemeToggle.svelte';
	import PhoneLink from './PhoneLink.svelte';

	const navItems = [
		{ href: '/live', label: m.nav_live },
		{ href: '/journal', label: m.nav_journal },
		{ href: '/about', label: m.nav_about },
		{ href: '/access', label: m.nav_access }
	];

	function isActive(href: string) {
		// page.url はロケールprefix付き（/en/live等）なので、比較前にカノニカルなパスへ戻す
		const path = deLocalizeUrl(page.url).pathname;
		return path === href || path.startsWith(`${href}/`);
	}
</script>

<header
	class="sticky top-0 z-40 border-b border-border bg-canvas/90 backdrop-blur supports-backdrop-filter:bg-canvas/75"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
		<a href={localePath('/')} class="font-display text-xl font-semibold tracking-wide text-brand">
			{m.site_name()}
		</a>

		<nav
			class="no-scrollbar flex flex-1 items-center gap-5 overflow-x-auto px-1 text-sm font-medium whitespace-nowrap sm:justify-center sm:gap-8"
			aria-label={m.site_name()}
		>
			{#each navItems as item (item.href)}
				<a
					href={localePath(item.href)}
					class="transition-colors hover:text-brand {isActive(item.href)
						? 'text-brand'
						: 'text-ink-muted'}"
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					{item.label()}
				</a>
			{/each}
		</nav>

		<div class="flex shrink-0 items-center gap-3">
			<PhoneLink
				class="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-ink hover:border-brand hover:text-brand md:inline-flex"
			/>
			<ThemeToggle />
		</div>
	</div>
</header>
