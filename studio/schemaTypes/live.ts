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
			// 名前は毎回手打ちせず、castマスタから選ぶ（外部キー参照）。楽器はマスタ化せず、
			// ライブごとの自由記述のまま（同じ人でもライブによって違う楽器を担当することがあるため）。
			of: [
				{
					type: 'object',
					name: 'performer',
					fields: [
						defineField({
							name: 'cast',
							title: '出演者',
							type: 'reference',
							to: [{ type: 'cast' }],
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
						select: { name: 'cast.name', instrument: 'instrument' },
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
		// performers[].cast は参照なので、ここ（配列まるごとのselect）では名前をデリファレンスできない
		// （Sanityの1階層デリファレンスは固定パスのみ対応。各performer行自体のpreviewは上のcast.nameで解決している）。
		// 一覧では人数だけ出す。
		select: { date: 'date', performers: 'performers' },
		prepare({ date, performers }) {
			const count = Array.isArray(performers) ? performers.length : 0;
			return {
				title: date ?? '(日付未設定)',
				subtitle: count ? `${count}名出演` : undefined
			};
		}
	}
});
