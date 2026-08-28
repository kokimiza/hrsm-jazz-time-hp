import type { PortableTextBlock } from '@portabletext/types';

export type Locale = 'ja' | 'en';

export type LocaleString = Partial<Record<Locale, string>>;
export type LocaleBlockContent = Partial<Record<Locale, PortableTextBlock[]>>;

export interface SanityImageRef {
	asset: {
		_ref: string;
		_type: 'reference';
	};
	alt?: string;
}

export interface LiveEntry {
	_id: string;
	date: string; // "YYYY-MM-DD"
	openTime?: string;
	startTime?: string;
	performers: string[];
}

export interface JournalListEntry {
	_id: string;
	slug: string;
	title: LocaleString;
	publishedAt: string;
	coverImage?: SanityImageRef;
	excerpt?: LocaleString;
	tag?: string;
}

export interface JournalEntry extends JournalListEntry {
	body: LocaleBlockContent;
}
