<script lang="ts">
	import type { Snippet } from 'svelte';
	import ArrowIcon from './ArrowIcon.svelte';

	let {
		href,
		class: className = '',
		children
	}: { href: string; class?: string; children: Snippet } = $props();
</script>

<!-- 「見出し →」の矢印だけ色が変わる静止リンクをやめ、ホバーで矢印がすっと動く形に統一する。
     hrefは呼び出し側で $lib/i18n の localePath() を通した値を渡す想定 -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	{href}
	class="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink hover:text-brand-ink-hover {className}"
>
	<span class="border-b border-transparent group-hover:border-current">{@render children()}</span>
	<ArrowIcon class="transition-transform duration-200 ease-out group-hover:translate-x-1" />
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
