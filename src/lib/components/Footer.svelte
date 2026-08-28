<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localePath } from '$lib/i18n';
	import PhoneLink from './PhoneLink.svelte';

	const year = new Date().getFullYear().toString();

	const navItems = [
		{ href: '/live', label: m.nav_live },
		{ href: '/journal', label: m.nav_journal },
		{ href: '/about', label: m.nav_about },
		{ href: '/access', label: m.nav_access }
	];
</script>

<footer class="border-t border-border bg-surface">
	<div
		class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 pb-28 sm:px-6 md:flex-row md:items-start md:justify-between md:pb-10"
	>
		<div class="space-y-2">
			<p class="font-display text-lg font-semibold text-brand">{m.site_name_full()}</p>
			<p class="text-sm text-ink-muted">
				{m.address_line1()}<br />
				{m.address_line2()}
			</p>
			<PhoneLink class="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand" />
		</div>

		<nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label={m.site_name()}>
			{#each navItems as item (item.href)}
				<a href={localePath(item.href)} class="text-ink-muted hover:text-brand">
					{item.label()}
				</a>
			{/each}
		</nav>
	</div>

	<div class="border-t border-border">
		<p class="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-muted sm:px-6">
			{m.footer_rights({ year })}
		</p>
	</div>
</footer>
