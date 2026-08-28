import { safeFetch } from './client';
import type { JournalEntry, JournalListEntry, LiveEntry } from './types';

/** GROQの `date >= $today` 比較のための "YYYY-MM-DD"（ビルド時点の日付で確定する）。 */
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const liveProjection = `{ _id, date, openTime, startTime, performers }`;

/** 今後のライブ一覧（開催日が近い順）。過去分・詳細ページは持たない。 */
export async function getUpcomingLives(): Promise<LiveEntry[]> {
	return safeFetch<LiveEntry[]>(
		`*[_type == "live" && date >= $today] | order(date asc) ${liveProjection}`,
		{ today: today() },
		[]
	);
}

/** 次回ライブ（Home用）。 */
export async function getNextLive(): Promise<LiveEntry | null> {
	return safeFetch<LiveEntry | null>(
		`*[_type == "live" && date >= $today] | order(date asc)[0] ${liveProjection}`,
		{ today: today() },
		null
	);
}

const journalListProjection = `{
	_id,
	"slug": slug.current,
	title,
	publishedAt,
	coverImage,
	excerpt,
	tag
}`;

export async function getLatestJournalEntries(limit: number): Promise<JournalListEntry[]> {
	return safeFetch<JournalListEntry[]>(
		`*[_type == "journal"] | order(publishedAt desc)[0...$limit] ${journalListProjection}`,
		{ limit },
		[]
	);
}

export async function getAllJournalEntries(): Promise<JournalListEntry[]> {
	return safeFetch<JournalListEntry[]>(
		`*[_type == "journal"] | order(publishedAt desc) ${journalListProjection}`,
		{},
		[]
	);
}

export async function getAllJournalSlugs(): Promise<string[]> {
	const rows = await safeFetch<{ slug: string }[]>(
		`*[_type == "journal" && defined(slug.current)]{ "slug": slug.current }`,
		{},
		[]
	);
	return rows.map((row) => row.slug);
}

const journalDetailProjection = `{
	_id,
	"slug": slug.current,
	title,
	publishedAt,
	coverImage,
	excerpt,
	tag,
	body
}`;

export async function getJournalEntryBySlug(slug: string): Promise<JournalEntry | null> {
	return safeFetch<JournalEntry | null>(
		`*[_type == "journal" && slug.current == $slug][0] ${journalDetailProjection}`,
		{ slug },
		null
	);
}
