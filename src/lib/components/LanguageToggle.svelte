<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';

	// ロケールは ja/en の2つだけなので、トグルボタン1つで「今と違う方」に切り替える。
	const otherLocale = $derived(locales.find((locale) => locale !== getLocale()) ?? locales[0]);
	const href = $derived(
		resolve(localizeHref(page.url.pathname, { locale: otherLocale }) as Pathname)
	);
</script>

<a
	{href}
	class="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-brand hover:text-brand"
	aria-label={m.language_toggle_label()}
	title={otherLocale.toUpperCase()}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		class="size-4.5"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="9" />
		<path
			stroke-linecap="round"
			d="M3 12h18M12 3c2.5 2.7 4 6.1 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6.1-4-9s1.5-6.3 4-9Z"
		/>
	</svg>
</a>
