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

	// 現在ページの下に、帯（indicator）をスライドさせるアニメーション。
	// SSR/プリレンダー時は $effect が走らないため、JS実行前は文字色の違いだけで
	// アクティブ状態を示す（帯はopacity:0で始まり、初期化後にふわっと現れる）。
	const linkEls: Record<string, HTMLAnchorElement> = {};
	let indicator = $state({ x: 0, width: 0, ready: false });

	function updateIndicator() {
		const activeHref = navItems.find((item) => isActive(item.href))?.href;
		const el = activeHref ? linkEls[activeHref] : undefined;
		// `indicator` 自体は読まずに書く。読んでしまうと、この関数を呼んでいる $effect が
		// 自分で書いた `indicator` の変化を検知してまた自分を再実行する無限ループになる
		// （Home（'/'）はnavItemsのどれにも一致しないため、このelse分岐に毎回入っていた）。
		indicator = el
			? { x: el.offsetLeft, width: el.offsetWidth, ready: true }
			: { x: 0, width: 0, ready: false };
	}

	$effect(() => {
		// page.url.pathname を依存として参照する → ページ遷移のたびに再計算される
		void page.url.pathname;
		updateIndicator();
	});

	$effect(() => {
		// フォント読み込み等でレイアウトが後から動くケースに追従
		window.addEventListener('resize', updateIndicator);
		return () => window.removeEventListener('resize', updateIndicator);
	});
</script>

<header
	class="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur supports-backdrop-filter:bg-canvas/85"
>
	<!-- ステージの緞帳のような、臙脂〜ゴールドの帯 -->
	<div class="h-0.75 bg-linear-to-r from-brand-deep via-brand to-gold"></div>

	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="flex items-center justify-between gap-4 py-5 sm:py-6">
			<a href={localePath('/')} class="flex flex-col leading-none">
				<span class="font-display text-2xl font-semibold tracking-wide text-brand-ink sm:text-3xl">
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
					class="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-ink hover:border-brand-ink hover:text-brand-ink md:inline-flex"
				/>
				<span class="hidden h-6 w-px bg-border md:block"></span>
				<ThemeToggle />
			</div>
		</div>

		<nav
			class="no-scrollbar relative flex items-center gap-7 overflow-x-auto border-t border-border py-3 text-sm font-medium tracking-wide whitespace-nowrap uppercase sm:justify-center sm:gap-12"
			aria-label={m.site_name()}
		>
			{#each navItems as item (item.href)}
				<a
					bind:this={linkEls[item.href]}
					href={localePath(item.href)}
					class="relative pb-1.5 transition-colors duration-300 hover:text-brand-ink {isActive(
						item.href
					)
						? 'text-brand-ink'
						: 'text-ink-muted'}"
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					{item.label()}
				</a>
			{/each}
			<!-- 現在ページへスライドする帯。JS初期化前（SSR/プリレンダー直後）は文字色の差だけで
			     アクティブ状態を示し、初期化後にこの帯がふわっと現れて以降は滑らかに追従する。 -->
			<span
				aria-hidden="true"
				class="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-linear-to-r from-brand-deep via-brand to-gold transition-[transform,width,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
				style:transform={`translateX(${indicator.x}px)`}
				style:width={`${indicator.width}px`}
				style:opacity={indicator.ready ? 1 : 0}
			></span>
		</nav>
	</div>
</header>
