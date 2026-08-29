import { defineField, defineType } from 'sanity';

/**
 * 日誌（ブログ）。運営が思ったことや出来事を綴る、ゆるいブログ/日誌枠。
 * 日本語のみ（英語版は持たない。サイトの言語切替に関わらず常に日本語で表示される）。
 * 投稿日時・URL(スラッグ)は運営に入力させず、自動で決まる。
 */
export default defineType({
	name: 'journal',
	title: 'Journal',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'タイトル',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'URL',
			type: 'slug',
			readOnly: true,
			description: '投稿した日時から自動で決まる。編集は不要。',
			// 「Generate」操作なしで、ドキュメント作成時に日付+時刻から自動採番する。
			initialValue: () => {
				const now = new Date();
				const pad = (n: number) => String(n).padStart(2, '0');
				const current =
					`${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
					`-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
				return { _type: 'slug', current };
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'coverImage',
			title: 'カバー画像',
			type: 'image',
			options: { hotspot: true },
			description:
				'掲載場所（一覧・詳細ページ）によって、画像の四辺が少し見切れることがあります。個別に調整することはできないので、主役（人物・楽器など）はなるべく写真の中央に写っているものを選んでください。画像上の丸いピンをドラッグすると、見切れても残したい部分の目安を指定できます。'
			// 代替テキストは運営に入力させず、サイト側で固定文言（「ブログカバー」）を使う。
		}),
		defineField({
			name: 'body',
			title: '本文',
			type: 'blockContent',
			validation: (rule) => rule.required()
		})
	],
	orderings: [
		{
			title: '投稿日時',
			name: 'createdAtDesc',
			by: [{ field: '_createdAt', direction: 'desc' }]
		}
	],
	preview: {
		select: { title: 'title', date: '_createdAt', media: 'coverImage' },
		prepare({ title, date, media }) {
			return {
				title: title || '(無題)',
				subtitle: date ? new Date(date).toLocaleDateString('ja-JP') : undefined,
				media
			};
		}
	}
});
