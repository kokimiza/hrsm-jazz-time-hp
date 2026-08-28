<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<div class="mx-auto max-w-6xl px-4 sm:px-6 {className}">
	{@render children()}
</div>
