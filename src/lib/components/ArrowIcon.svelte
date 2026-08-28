<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<svg
	viewBox="0 0 16 16"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	class="size-3.5 shrink-0 {className}"
	aria-hidden="true"
>
	<path stroke-linecap="round" stroke-linejoin="round" d="M3 8h10m0 0-4-4m4 4-4 4" />
</svg>
