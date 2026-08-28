import { defineField, defineType } from 'sanity';

/**
 * ライブスケジュール。詳細ページは持たず、日付・時間・出演者のみのシンプルな一覧に使う。
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
			name: 'openTime',
			title: '開場時間',
			type: 'string',
			description: '例: 18:30'
		}),
		defineField({
			name: 'startTime',
			title: '開演時間',
			type: 'string',
			description: '例: 19:00'
		}),
		defineField({
			name: 'performers',
			title: '出演者',
			type: 'array',
			of: [{ type: 'string' }],
			options: { layout: 'tags' },
			validation: (rule) => rule.required().min(1)
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
			return {
				title: date ?? '(日付未設定)',
				subtitle: Array.isArray(performers) ? performers.join(' / ') : undefined
			};
		}
	}
});
