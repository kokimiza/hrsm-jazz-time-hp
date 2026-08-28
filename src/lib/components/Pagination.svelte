<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localePath } from '$lib/i18n';

	// ページ1は `basePath`、ページ2以降は `basePath/2`, `basePath/3`, ... というURLにする前提。
	let { basePath, page, totalPages }: { basePath: string; page: number; totalPages: number } =
		$props();

	const prevHref = $derived(page <= 2 ? basePath : `${basePath}/${page - 1}`);
	const nextHref = $derived(`${basePath}/${page + 1}`);
</script>

{#if totalPages > 1}
	<nav class="mt-8 flex items-center justify-between" aria-label="pagination">
		{#if page > 1}
			<a href={localePath(prevHref)} class="text-sm font-medium text-brand-ink hover:underline">
				← {m.pagination_prev()}
			</a>
		{:else}
			<span></span>
		{/if}

		<span class="text-sm text-ink-muted">
			{m.pagination_page_of({ page: String(page), total: String(totalPages) })}
		</span>

		{#if page < totalPages}
			<a href={localePath(nextHref)} class="text-sm font-medium text-brand-ink hover:underline">
				{m.pagination_next()} →
			</a>
		{:else}
			<span></span>
		{/if}
	</nav>
{/if}
