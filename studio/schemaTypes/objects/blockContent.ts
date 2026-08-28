import { defineType } from 'sanity';

/** Portable Text本文（画像埋め込み可）。journalのbodyで使う。 */
export default defineType({
	name: 'blockContent',
	title: 'Block content',
	type: 'array',
	of: [
		{ type: 'block' },
		{
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', title: '代替テキスト', type: 'string' }]
		}
	]
});
