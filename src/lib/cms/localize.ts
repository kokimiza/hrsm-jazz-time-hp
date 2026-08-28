import type { Locale, LocaleBlockContent, LocaleString } from './types';

/**
 * localeString/localeBlockContent から現在ロケールの値を取り出す。
 * 未入力なら日本語 → 英語の順にフォールバックする（運営はja入力のみでも成立する）。
 */
export function pickLocale(value: LocaleString | undefined | null, locale: Locale): string {
	if (!value) return '';
	return value[locale] || value.ja || value.en || '';
}

export function pickLocaleBlocks(value: LocaleBlockContent | undefined | null, locale: Locale) {
	if (!value) return [];
	return value[locale] ?? value.ja ?? value.en ?? [];
}
