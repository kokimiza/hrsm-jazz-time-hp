import type { Locale } from '$lib/paraglide/runtime';
import type { Performer } from '$lib/cms/types';

/** "YYYY-MM-DD" / ISO datetime のどちらでも受けられるようにする（時刻なしはローカル日付として解釈）。 */
function parseDate(dateStr: string): Date {
	return new Date(dateStr.length <= 10 ? `${dateStr}T00:00:00` : dateStr);
}

/**
 * 店の現地日付（日本時間）の "YYYY-MM-DD"。ライブの `date` との比較に使う。
 * UTCのままだと日本の0〜9時の間は前日扱いになり、昨日のライブが「今後」に残ってしまう。
 * 閲覧者のタイムゾーンにも依らないよう、JST（UTC+9・夏時間なし）に固定して計算する。
 */
export function todayInJapan(now: Date = new Date()): string {
	return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function intl(locale: Locale) {
	return locale === 'ja' ? 'ja-JP' : 'en-US';
}

/** ライブ日付・日誌の投稿日を、現在ロケールに合わせて整形する（例: "2026年9月28日(月)"）。 */
export function formatDate(dateStr: string, locale: Locale): string {
	return new Intl.DateTimeFormat(intl(locale), {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'short'
	}).format(parseDate(dateStr));
}

export interface DateParts {
	day: number;
	weekday: string;
	/** 0=日 … 6=土。曜日ごとの色分け（土=青／日=赤）の判定に使う。 */
	weekdayIndex: number;
}

/** ライブ予定表の日付欄用に、日付を「日」「曜日」に分解する。月は月見出し側が持つ。 */
export function formatDateParts(dateStr: string, locale: Locale): DateParts {
	const date = parseDate(dateStr);
	return {
		day: date.getDate(),
		weekday: new Intl.DateTimeFormat(intl(locale), { weekday: 'short' }).format(date),
		weekdayIndex: date.getDay()
	};
}

/** ライブカレンダーの月見出し（例: "2026年9月" / "September 2026"）。 */
export function formatMonthHeading(dateStr: string, locale: Locale): string {
	return new Intl.DateTimeFormat(intl(locale), { year: 'numeric', month: 'long' }).format(
		parseDate(dateStr)
	);
}

/** グループ化キー（"YYYY-MM"）。同じ月かどうかの判定に使う。 */
export function monthKey(dateStr: string): string {
	return dateStr.slice(0, 7);
}

/** 出演者を「名前（楽器）」の表記に組み立てる。楽器が未入力なら名前のみ。 */
export function formatPerformer(performer: Performer): string {
	return performer.instrument ? `${performer.name}（${performer.instrument}）` : performer.name;
}
