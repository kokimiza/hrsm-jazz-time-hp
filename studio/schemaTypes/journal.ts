import { defineField, defineType } from 'sanity';

/** 日誌（ブログ）。運営が思ったことや出来事を綴る、ゆるいブログ/日誌枠。 */
export default defineType({
	name: 'journal',
	title: 'Journal',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'タイトル',
			type: 'localeString',
			validation: (rule) =>
				rule.custom((value: { ja?: string } | undefined) =>
					value?.ja ? true : '日本語タイトルは必須です'
				)
		}),
		defineField({
			name: 'slug',
			title: 'スラッグ',
			type: 'slug',
			options: {
				source: (doc) => (doc as { title?: { ja?: string } }).title?.ja ?? '',
				maxLength: 96
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'publishedAt',
			title: '投稿日時',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'coverImage',
			title: 'カバー画像',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', title: '代替テキスト', type: 'string' }]
		}),
		defineField({
			name: 'excerpt',
			title: '抜粋（一覧・SNSシェア用）',
			type: 'localeText'
		}),
		defineField({
			name: 'tag',
			title: 'タグ',
			type: 'string',
			options: {
				list: [
					{ title: 'Live report', value: 'live-report' },
					{ title: 'お知らせ', value: 'news' },
					{ title: 'つぶやき', value: 'diary' }
				]
			}
		}),
		defineField({
			name: 'body',
			title: '本文',
			type: 'localeBlockContent',
			validation: (rule) =>
				rule.custom((value: { ja?: unknown[] } | undefined) =>
					value?.ja?.length ? true : '日本語本文は必須です'
				)
		})
	],
	orderings: [
		{
			title: '投稿日時',
			name: 'publishedAtDesc',
			by: [{ field: 'publishedAt', direction: 'desc' }]
		}
	],
	preview: {
		select: { title: 'title.ja', date: 'publishedAt', media: 'coverImage' },
		prepare({ title, date, media }) {
			return {
				title: title || '(無題)',
				subtitle: date ? new Date(date).toLocaleDateString('ja-JP') : undefined,
				media
			};
		}
	}
});
