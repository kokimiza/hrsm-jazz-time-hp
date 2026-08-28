import { ARCHIVE_PAGE_SIZE, getAllJournalEntries, getPastLivesCount } from '$lib/cms/queries';
import { locales } from '$lib/paraglide/runtime';
import { absoluteLocalizedUrl } from '$lib/site';

// journal記事・ライブアーカイブのページ数はSanity側で増減するため、
// ビルドのたびにCMSへ問い合わせて最新の一覧を反映する。
// （運営が投稿→Webhookでサイトが再ビルド→sitemap.xmlも自動で更新、という流れになる）
export const prerender = true;

const STATIC_PATHS = ['/', '/about', '/live', '/live/archive', '/journal', '/access'];

function xmlEscape(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET = async () => {
	const [journalEntries, pastLivesCount] = await Promise.all([
		getAllJournalEntries(),
		getPastLivesCount()
	]);
	const archiveTotalPages = Math.max(1, Math.ceil(pastLivesCount / ARCHIVE_PAGE_SIZE));
	const archivePageNumbers = Array.from({ length: archiveTotalPages - 1 }, (_, i) => i + 2);

	const pages: { path: string; lastmod?: string }[] = [
		...STATIC_PATHS.map((path) => ({ path })),
		...archivePageNumbers.map((page) => ({ path: `/live/archive/${page}` })),
		...journalEntries.map((entry) => ({
			path: `/journal/${entry.slug}`,
			lastmod: entry.publishedAt?.slice(0, 10)
		}))
	];

	const urlBlocks = pages.map(({ path, lastmod }) => {
		// 各ページはロケールの数だけURLを持つ。hreflangで互いを参照し合い、
		// 検索エンジンに「同じページのja/en版」であることを伝える。
		const alternateLinks = locales
			.map(
				(locale) =>
					`<xhtml:link rel="alternate" hreflang="${locale}" href="${xmlEscape(absoluteLocalizedUrl(path, locale))}" />`
			)
			.join('\n      ');

		return locales
			.map(
				(locale) => `  <url>
    <loc>${xmlEscape(absoluteLocalizedUrl(path, locale))}</loc>
      ${alternateLinks}${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`
			)
			.join('\n');
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
