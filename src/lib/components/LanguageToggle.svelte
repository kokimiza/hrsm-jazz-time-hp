<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, locales, localizeHref } from '$lib/paraglide/runtime';

	// ロケールは ja/en の2つだけなので、トグルボタン1つで「今と違う方」に切り替える。
	const otherLocale = $derived(locales.find((locale) => locale !== getLocale()) ?? locales[0]);
	// localizeHrefにはロケールprefix無しの正規パスを渡す必要がある（例: /en/about → /about）。
	// 現在のURLをそのまま渡すと、EN版にいるときに「切替先のhrefがEN版のまま」になるバグになる。
	const canonicalPath = $derived(deLocalizeHref(page.url.pathname));
	const href = $derived(resolve(localizeHref(canonicalPath, { locale: otherLocale }) as Pathname));
</script>

<!-- data-sveltekit-reload: ロケール切替はSPA遷移ではなく必ずフルページ遷移にする。
     SvelteKitのクライアントサイド遷移だとURLは変わっても表示中のロケール（文言）が
     再評価されず、見た目上「何も変わらない」状態になってしまうため。 -->
<a
	{href}
	data-sveltekit-reload
	class="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-brand-ink hover:text-brand-ink"
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
