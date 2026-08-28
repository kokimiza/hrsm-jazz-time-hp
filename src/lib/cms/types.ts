import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImageRef {
	asset: {
		_ref: string;
		_type: 'reference';
	};
}

export interface Performer {
	name: string;
	instrument?: string;
}

export interface LiveEntry {
	_id: string;
	date: string; // "YYYY-MM-DD"
	performers: Performer[];
	note?: string;
}

/**
 * 日誌（ブログ）は日本語のみ。タイトル・本文は多言語化せず、
 * サイトの言語切替（ja/en）に関わらず常に日本語のまま表示する。
 */
export interface JournalListEntry {
	_id: string;
	slug: string;
	title: string;
	publishedAt: string; // Sanityの `_createdAt` をエイリアスしたもの（投稿日時は自動）
	coverImage?: SanityImageRef;
}

export interface JournalEntry extends JournalListEntry {
	body: PortableTextBlock[];
}
