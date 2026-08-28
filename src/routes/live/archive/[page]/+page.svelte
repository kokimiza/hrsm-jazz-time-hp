<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import LiveArchiveView from '$lib/components/LiveArchiveView.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.live_archive_heading()} | {m.site_name()}</title>
</svelte:head>

<LiveArchiveView lives={data.lives} page={data.page} totalPages={data.totalPages} />
