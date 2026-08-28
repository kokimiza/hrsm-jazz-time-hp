<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { theme, type ThemeMode } from '$lib/stores/theme.svelte';

	const options: { mode: ThemeMode; label: () => string }[] = [
		{ mode: 'light', label: m.theme_light },
		{ mode: 'dark', label: m.theme_dark },
		{ mode: 'system', label: m.theme_system }
	];
</script>

<div
	class="inline-flex items-center gap-0.5 rounded-full border border-border p-0.5"
	role="radiogroup"
	aria-label={m.theme_toggle_label()}
>
	{#each options as option (option.mode)}
		<button
			type="button"
			role="radio"
			aria-checked={theme.mode === option.mode}
			onclick={() => theme.set(option.mode)}
			class="rounded-full px-2.5 py-1 text-xs transition-colors
				{theme.mode === option.mode ? 'bg-brand text-white' : 'text-ink-muted hover:text-ink'}"
		>
			{option.label()}
		</button>
	{/each}
</div>
