import { defineType } from 'sanity';

/** 日誌の本文。ja/en両方をPortable Textで持つ。英語は未入力でも可（サイト側でjaにフォールバック）。 */
export default defineType({
	name: 'localeBlockContent',
	title: 'Localized block content',
	type: 'object',
	fields: [
		{ name: 'ja', title: '日本語', type: 'blockContent' },
		{ name: 'en', title: 'English', type: 'blockContent' }
	]
});
