<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localePath } from '$lib/i18n';
	import PhoneLink from './PhoneLink.svelte';
</script>

<!-- モバイル専用の固定クイックアクセス（次回ライブ／電話／アクセスに1タップで届く） -->
<nav
	class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
	aria-label={m.site_name()}
>
	<div class="grid grid-cols-3">
		<a
			href={localePath('/live')}
			class="flex flex-col items-center gap-1 py-2.5 text-xs text-ink-muted hover:text-brand"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				class="size-5"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4 19V6.2a1 1 0 0 1 .55-.9l6-3a1 1 0 0 1 .9 0l6 3a1 1 0 0 1 .55.9V19M4 19h16M4 19v-6h4v6M14 19v-4h4v4"
				/>
			</svg>
			{m.nav_live()}
		</a>

		<PhoneLink
			label={m.phone_label()}
			class="flex flex-col items-center gap-1 border-x border-border py-2.5 text-xs text-ink-muted hover:text-brand"
		/>

		<a
			href={localePath('/access')}
			class="flex flex-col items-center gap-1 py-2.5 text-xs text-ink-muted hover:text-brand"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				class="size-5"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
				/>
				<circle cx="12" cy="10" r="2.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			{m.nav_access()}
		</a>
	</div>
</nav>
