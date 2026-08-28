<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { theme } from '$lib/stores/theme.svelte';
</script>

<!-- ライト⇄ダークのアイコントグル。初期値はシステム設定に追従し、押した時点で明示的な選択に切り替わる -->
<button
	type="button"
	onclick={() => theme.toggle()}
	class="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-brand-ink hover:text-brand-ink"
	aria-label={m.theme_toggle_label()}
	title={m.theme_toggle_label()}
>
	{#if theme.resolved === 'dark'}
		<!-- moon -->
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			class="size-4.5"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
			/>
		</svg>
	{:else}
		<!-- sun -->
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			class="size-4.5"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				stroke-linecap="round"
				d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
			/>
		</svg>
	{/if}
</button>
