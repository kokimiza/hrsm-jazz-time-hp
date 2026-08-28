<script lang="ts">
	// Home以外のページでも「同じ店の空気感」がうっすら伝わるよう、店内写真を
	// ごく低い不透明度で背景に残す（Homeの主役ヒーロー写真とは別の、控えめな演出）。
	// Heroで使っているのと同じ圧縮済みwebpを再利用（軽量な1200w版で十分）。
	import interior from '$lib/assets/jazztime-interior-1200.webp';
</script>

<img
	src={interior}
	alt=""
	aria-hidden="true"
	fetchpriority="low"
	class="pointer-events-none fixed inset-0 -z-10 h-full w-full scale-110 object-cover opacity-[0.05] blur-2xl dark:opacity-[0.08]"
/>
