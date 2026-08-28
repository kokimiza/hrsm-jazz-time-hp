import { defineField, defineType } from 'sanity';

/**
 * ライブスケジュール。詳細ページは持たず、日付・出演者・（任意の）補足のみのシンプルな一覧に使う。
 * 開催日が過ぎたものはサイト側で自動的に一覧から外れる（アーカイブ機能は持たない）。
 */
export default defineType({
	name: 'live',
	title: 'Live',
	type: 'document',
	fields: [
		defineField({
			name: 'date',
			title: '開催日',
			type: 'date',
			options: { dateFormat: 'YYYY-MM-DD' },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'performers',
			title: '出演者',
			type: 'array',
			// 「Alice(P)」のように名前と楽器を1本の文字列で毎回書くのは面倒＆表記ゆれの元なので、
			// 名前と楽器を別フィールドに分け、表示時の組み立て（"Alice（Piano）"）はサイト側で行う。
			of: [
				{
					type: 'object',
					name: 'performer',
					fields: [
						defineField({
							name: 'name',
							title: '名前',
							type: 'string',
							validation: (rule) => rule.required()
						}),
						defineField({
							name: 'instrument',
							title: '楽器',
							type: 'string',
							description: '例: Piano / Bass / Drums / Sax / Vocal（空欄でも可）'
						})
					],
					preview: {
						select: { name: 'name', instrument: 'instrument' },
						prepare({ name, instrument }) {
							return { title: instrument ? `${name}（${instrument}）` : name };
						}
					}
				}
			],
			validation: (rule) => rule.required().min(1)
		}),
		defineField({
			name: 'note',
			title: '補足',
			type: 'text',
			rows: 2,
			description: '開場・開演時間など、書きたいことがあれば自由に（任意）'
		})
	],
	orderings: [
		{
			title: '開催日',
			name: 'dateDesc',
			by: [{ field: 'date', direction: 'desc' }]
		}
	],
	preview: {
		select: { date: 'date', performers: 'performers' },
		prepare({ date, performers }) {
			const names = Array.isArray(performers)
				? performers
						.map((p: { name?: string; instrument?: string }) =>
							p.instrument ? `${p.name}（${p.instrument}）` : p.name
						)
						.join(' / ')
				: undefined;
			return {
				title: date ?? '(日付未設定)',
				subtitle: names
			};
		}
	}
});
