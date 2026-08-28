import { defineType } from 'sanity';

/** 抜粋（excerpt）用の複数行テキスト。ja/en両方を保持する。 */
export default defineType({
	name: 'localeText',
	title: 'Localized text',
	type: 'object',
	fields: [
		{ name: 'ja', title: '日本語', type: 'text', rows: 3 },
		{ name: 'en', title: 'English', type: 'text', rows: 3 }
	]
});
