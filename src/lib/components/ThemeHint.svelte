<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { fly } from 'svelte/transition';
	import { theme } from '$lib/stores/theme.svelte';

	/** 一度案内を見た人には二度と出さないための印（テーマ本体と同じくlocalStorageで持つ）。 */
	const HINT_STORAGE_KEY = 'jazztime-theme-hint-seen';
	/** ページが描画し終わってから、遅れてふわっと出す。開くなり被さってくると鬱陶しいため。 */
	const APPEAR_DELAY_MS = 1400;
	/** 出したあと、放っておいても自分から引っ込むまで。2行を読み切れる長さは取りつつ、居座らせない。 */
	const AUTO_DISMISS_MS = 9000;

	let visible = $state(false);
	let reduceMotion = $state(false);

	/** 保存済みかどうかのフラグ。$stateにするとdismiss()と$effectが互いを呼び合うので、あえて素の変数。 */
	let stored = false;

	// 初回訪問かはlocalStorageでしか分からない＝プリレンダー時には判定できないので、
	// マウント後にだけ表示を立てる。再訪者のHTMLには最初から何も入らないため、
	// 「一瞬出てから消える」チラつきが起きない。
	$effect(() => {
		let seen = true;
		try {
			seen = window.localStorage.getItem(HINT_STORAGE_KEY) === '1';
		} catch {
			// プライベートブラウジング等でlocalStorageが読めないときは「出さない」側に倒す。
			// 毎回出てしまうより、出ないほうが害が小さい。
		}
		if (seen) return;

		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let hideTimer: ReturnType<typeof setTimeout> | undefined;
		const showTimer = setTimeout(() => {
			visible = true;
			// 9秒は「出てから」数える。表示待ちの1.4秒を含めると、その分だけ読む時間が削られる。
			hideTimer = setTimeout(dismiss, AUTO_DISMISS_MS);
		}, APPEAR_DELAY_MS);

		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
		};
	});

	function dismiss() {
		visible = false;
		if (stored) return;
		stored = true;
		try {
			window.localStorage.setItem(HINT_STORAGE_KEY, '1');
		} catch {
			// 保存できなくても、この訪問中は閉じたままになる
		}
	}

	// テーマを実際に切り替えたなら案内の役目は済んでいる。閉じるのを待たずに引っ込める。
	const initialMode = theme.mode;
	$effect(() => {
		if (theme.mode !== initialMode) dismiss();
	});

	function handleKeydown(event: KeyboardEvent) {
		if (visible && event.key === 'Escape') dismiss();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- 初回訪問者にだけ出す、右上のテーマ切替ボタンへの案内。
     親（Header側）の relative な入れ物に対して絶対配置するので、
     スクロールしてもsticky headerごと動き、常にボタンを指したままになる。 -->
{#if visible}
	<!-- ボタンを包む金色の灯り。ボタンより後ろ（-z-10）に敷き、クリックは通す。 -->
	<span
		aria-hidden="true"
		class="theme-hint-halo pointer-events-none absolute -inset-2 -z-10 rounded-full"
	></span>

	<div
		role="status"
		class="theme-hint-card absolute top-full right-0 mt-3.5 w-max max-w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-gold/45 bg-surface p-4 text-left"
		transition:fly={{ y: -8, duration: reduceMotion ? 0 : 260 }}
	>
		<!-- ボタンの中心を指す三角。ボタンはsize-9(36px)なので中心は右端から18px、
		     一辺10pxの四角を45度回すので right = 18 - 5 = 13px に置くと先端が中心に合う。 -->
		<span
			aria-hidden="true"
			class="absolute -top-1.25 right-3.25 size-2.5 rotate-45 border-t border-l border-gold/45 bg-surface"
		></span>

		<div class="flex items-start gap-3">
			<div class="space-y-1">
				<p class="text-base font-medium text-ink">{m.theme_hint_title()}</p>
				<p class="text-sm text-ink-muted">{m.theme_hint_body()}</p>
			</div>
			<button
				type="button"
				onclick={dismiss}
				class="-mt-1.5 -mr-1.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
				aria-label={m.theme_hint_close()}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					class="size-4.5"
					aria-hidden="true"
				>
					<path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
				</svg>
			</button>
		</div>
	</div>
{/if}
