<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
</script>

<!--
	マスター（お店の顔）の紹介。CMSの `cast`（出演ミュージシャンのマスタ）とは別物として、
	あえて参照しない独立コンポーネント——キャストは「その日の出演者」、マスターは「常にそこに
	いる人」なので、運営が投稿・入れ替えるデータではなく静的なプロフィールとして固定で持つ。

	見た目は演奏会パンフレットの指揮者紹介・論文の著者略歴のような、フォーマルな一枚のプロフィール
	カードを意識している（写真の代わりに、名前の一字を額装したメダリオンを肖像の代わりに置く）。

	NOTE: master_bio（messages/ja.json・en.json）は仮のドラフト文言。実際の運営者に確認のうえ、
	最終コピーに差し替えること。
-->
<article class="grain rounded-2xl border border-border bg-surface p-8 sm:p-10">
	<div class="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8">
		<div
			class="mx-auto flex size-20 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-3xl text-gold sm:mx-0 sm:size-24 sm:text-4xl"
			aria-hidden="true"
		>
			{m.master_monogram()}
		</div>

		<div class="space-y-4 text-center sm:text-left">
			<p class="font-display text-sm font-medium tracking-[0.3em] text-gold uppercase">
				{m.master_kicker()}
			</p>

			<div>
				<h3 class="font-display text-2xl font-semibold text-ink sm:text-3xl">
					{m.master_name()}
				</h3>
				<p class="mt-1 text-sm tracking-wide text-ink-muted uppercase">
					{m.master_role()}
				</p>
			</div>

			<hr class="mx-auto w-16 border-border sm:mx-0" />

			<p class="max-w-2xl text-base leading-relaxed text-ink-muted">
				{m.master_bio()}
			</p>
		</div>
	</div>
</article>
