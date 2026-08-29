import { safeFetch } from './client';
import type { CastMember, JournalEntry, JournalListEntry, LiveEntry } from './types';

/** GROQの `date >= $today` 比較のための "YYYY-MM-DD"（ビルド時点の日付で確定する）。 */
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

// performers[].cast はcastマスタへの参照。表示用に名前をデリファレンスして
// 従来通り `{ name, instrument }` の形でサイト側に渡す（表示コンポーネント側は変更不要）。
// 店休日はperformersを持たないので、コンポーネント側の null チェックを増やさないよう空配列に揃える。
const liveProjection = `{
	_id,
	date,
	"performers": coalesce(performers[]{ "name": cast->name, instrument }, []),
	note,
	closed
}`;

/** 今後のライブ一覧（開催日が近い順）。過去分・詳細ページは持たない。店休日も一覧に含めて表示する。 */
export async function getUpcomingLives(): Promise<LiveEntry[]> {
	return safeFetch<LiveEntry[]>(
		`*[_type == "live" && date >= $today] | order(date asc) ${liveProjection}`,
		{ today: today() },
		[]
	);
}

/** 次回ライブ（Home用）。店休日は「次回のライブ」ではないので対象外にする。 */
export async function getNextLive(): Promise<LiveEntry | null> {
	return safeFetch<LiveEntry | null>(
		`*[_type == "live" && date >= $today && closed != true] | order(date asc)[0] ${liveProjection}`,
		{ today: today() },
		null
	);
}

/** 過去ライブ（アーカイブ）の1ページあたりの件数。 */
export const ARCHIVE_PAGE_SIZE = 12;

/** 過去ライブの総件数（ページ数の計算に使う）。 */
export async function getPastLivesCount(): Promise<number> {
	return safeFetch<number>(`count(*[_type == "live" && date < $today])`, { today: today() }, 0);
}

/** 過去ライブ一覧（開催日が新しい順）。1ページ分だけ返す。 */
export async function getPastLives(page: number): Promise<LiveEntry[]> {
	const start = (page - 1) * ARCHIVE_PAGE_SIZE;
	const end = start + ARCHIVE_PAGE_SIZE;
	return safeFetch<LiveEntry[]>(
		`*[_type == "live" && date < $today] | order(date desc) [$start...$end] ${liveProjection}`,
		{ today: today(), start, end },
		[]
	);
}

// 投稿日時は運営が入力する項目ではなく、Sanityが自動で持つ `_createdAt` をそのまま使う
// （コード側は従来通り `publishedAt` という名前で扱えるよう、projectionでエイリアスする）。
const journalListProjection = `{
	_id,
	"slug": slug.current,
	title,
	"publishedAt": _createdAt,
	coverImage
}`;

export async function getLatestJournalEntries(limit: number): Promise<JournalListEntry[]> {
	return safeFetch<JournalListEntry[]>(
		`*[_type == "journal"] | order(_createdAt desc)[0...$limit] ${journalListProjection}`,
		{ limit },
		[]
	);
}

export async function getAllJournalEntries(): Promise<JournalListEntry[]> {
	return safeFetch<JournalListEntry[]>(
		`*[_type == "journal"] | order(_createdAt desc) ${journalListProjection}`,
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
	"publishedAt": _createdAt,
	coverImage,
	body
}`;

export async function getJournalEntryBySlug(slug: string): Promise<JournalEntry | null> {
	return safeFetch<JournalEntry | null>(
		`*[_type == "journal" && slug.current == $slug][0] ${journalDetailProjection}`,
		{ slug },
		null
	);
}

/** キャスト（出演ミュージシャン）一覧。無効化されたメンバーはサイトには出さない。 */
export async function getActiveCast(): Promise<CastMember[]> {
	return safeFetch<CastMember[]>(
		`*[_type == "cast" && active == true] | order(name asc) { _id, name, icon, bio }`,
		{},
		[]
	);
}
