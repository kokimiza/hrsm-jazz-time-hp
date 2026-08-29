<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import PhoneLink from './PhoneLink.svelte';
	import LanguageToggle from './LanguageToggle.svelte';

	const year = new Date().getFullYear().toString();
</script>

<footer class="grain border-t border-border bg-surface">
	<div
		class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 pb-28 sm:px-6 md:flex-row md:items-start md:justify-between md:pb-10"
	>
		<div class="space-y-2">
			<p class="font-display text-lg font-semibold text-brand-ink">{m.site_name_full()}</p>
			<p class="text-sm text-ink-muted">
				{m.address_line1()}<br />
				{m.address_line2()}
			</p>
			<PhoneLink
				class="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-ink"
			/>
		</div>
	</div>

	<div class="border-t border-border">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
			<p class="text-xs text-ink-muted">{m.footer_rights({ year })}</p>
			<LanguageToggle />
		</div>
	</div>
</footer>
