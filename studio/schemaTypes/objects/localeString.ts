import { defineType } from 'sanity';

/** 1ドキュメント内でja/enを両方管理するための短文フィールド。 */
export default defineType({
	name: 'localeString',
	title: 'Localized string',
	type: 'object',
	fields: [
		{ name: 'ja', title: '日本語', type: 'string' },
		{ name: 'en', title: 'English', type: 'string' }
	]
});
