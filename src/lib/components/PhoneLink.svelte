<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let { class: className = '', label = m.phone_number() }: { class?: string; label?: string } =
		$props();

	const digits = m.phone_number().replace(/[^0-9+]/g, '');
</script>

<a href="tel:{digits}" class={className} aria-label={m.call_now()}>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		class="size-4 shrink-0"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3.5 5.5c0-1.1.9-2 2-2H8l1.6 4-2 1.6a12 12 0 0 0 5.4 5.4l1.6-2 4 1.6v2.5c0 1.1-.9 2-2 2C9.5 18.6 5.4 14.5 3.5 7.5V5.5Z"
		/>
	</svg>
	<span>{label}</span>
</a>
