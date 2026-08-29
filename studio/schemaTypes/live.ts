import { defineField, defineType } from 'sanity';

/**
 * ライブスケジュール。詳細ページは持たず、日付・出演者・（任意の）補足のみのシンプルな一覧に使う。
 * 開催日が過ぎたものはサイト側で自動的に一覧から外れる（アーカイブ機能は持たない）。
 *
 * 「店休日」の記録もこのスキーマで扱う（例: 臨時休業、貸切など）。出演者なしの
 * 特殊なライブとしてではなく、castマスタを汚さない専用フラグ（closed）で表現する。
 * closedがONの間はperformersの入力欄が隠れ・必須も外れ、サイト側では一覧の中で
 * その日だけグレーアウト表示になる（§src/lib/cms/queries.ts, LiveCalendar.svelte参照）。
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
			name: 'closed',
			title: '店休日',
			type: 'boolean',
			initialValue: false,
			description:
				'臨時休業・貸切などでライブが無い日を記録する場合はON。ONの間は出演者欄が隠れ、' +
				'サイトの一覧ではその日がグレーアウトして表示される（「休み」というキャストは作らない）。'
		}),
		defineField({
			name: 'performers',
			title: '出演者',
			type: 'array',
			// 名前は毎回手打ちせず、castマスタから選ぶ（外部キー参照）。楽器はマスタ化せず、
			// ライブごとの自由記述のまま（同じ人でもライブによって違う楽器を担当することがあるため）。
			hidden: ({ parent }) => Boolean(parent?.closed),
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
			// 店休日（closed）は出演者なしが正しい状態なので、その場合だけ必須を外す。
			validation: (rule) =>
				rule.custom((performers, context) => {
					const parent = context.parent as { closed?: boolean } | undefined;
					if (parent?.closed) return true;
					return Array.isArray(performers) && performers.length > 0
						? true
						: '出演者を1名以上入力してください（店休日として登録する場合は「店休日」をONにしてください）';
				})
		}),
		defineField({
			name: 'note',
			title: '補足',
			type: 'text',
			rows: 2,
			description:
				'開場・開演時間など、書きたいことがあれば自由に（任意）。店休日の場合はここに理由（臨時休業／貸切 等）を書いてもよい。'
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
		// 一覧では人数だけ出す（店休日は出演者ではなく「店休」であることを出す）。
		select: { date: 'date', performers: 'performers', closed: 'closed', note: 'note' },
		prepare({ date, performers, closed, note }) {
			if (closed) {
				return {
					title: date ?? '(日付未設定)',
					subtitle: note ? `店休：${note}` : '店休'
				};
			}
			const count = Array.isArray(performers) ? performers.length : 0;
			return {
				title: date ?? '(日付未設定)',
				subtitle: count ? `${count}名出演` : undefined
			};
		}
	}
});
