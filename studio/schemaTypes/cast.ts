import { defineField, defineType } from 'sanity';

/**
 * キャスト（出演ミュージシャン）マスタ。
 * ライブの出演者は、毎回名前を手打ちするのではなくここから選ぶ（外部キー参照）。
 * 楽器はここでは持たない（マスタ化せず、ライブごとの自由記述のまま。§live.ts参照）。
 */
export default defineType({
	name: 'cast',
	title: 'Cast',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: '名前',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'active',
			title: '有効',
			type: 'boolean',
			initialValue: true,
			description:
				'オフにすると、サイトのキャスト一覧ページに表示されなくなる（過去のライブの出演記録は残る）',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'icon',
			title: 'アイコン画像',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'bio',
			title: '説明文',
			type: 'text',
			rows: 4
		})
	],
	orderings: [
		{
			title: '名前',
			name: 'nameAsc',
			by: [{ field: 'name', direction: 'asc' }]
		}
	],
	preview: {
		select: { title: 'name', active: 'active', media: 'icon' },
		prepare({ title, active, media }) {
			return {
				title: title || '(名前未設定)',
				subtitle: active === false ? '無効' : undefined,
				media
			};
		}
	}
});
