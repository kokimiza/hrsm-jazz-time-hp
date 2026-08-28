<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		class: className = '',
		children
	}: {
		href: string;
		variant?: 'primary' | 'secondary';
		class?: string;
		children: Snippet;
	} = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-colors';
	const variants = {
		// primaryだけ紙の手触り（.grain）を乗せる。secondaryは背景が透明なので効果が出ない。
		primary: 'grain bg-brand text-white hover:bg-brand-deep',
		secondary: 'border border-border text-ink hover:border-brand hover:text-brand'
	};
</script>

<!-- hrefは呼び出し側で $lib/i18n の localePath()（内部でresolve()を使用）を通した値を渡す想定 -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class="{base} {variants[variant]} {className}">
	{@render children()}
</a>
