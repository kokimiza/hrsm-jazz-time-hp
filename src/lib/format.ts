import type { Locale } from '$lib/cms/types';

/** ライブ日付・日誌の投稿日を、現在ロケールに合わせて整形する。 */
export function formatDate(dateStr: string, locale: Locale): string {
	const date = new Date(dateStr.length <= 10 ? `${dateStr}T00:00:00` : dateStr);
	return new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'short'
	}).format(date);
}
