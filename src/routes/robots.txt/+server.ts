import { siteOrigin } from '$lib/site';

// sitemap.xmlの場所をPUBLIC_SITE_URLに合わせて自動で書き出す
// （static/robots.txt を廃止してこちらに一本化）。
export const prerender = true;

export const GET = async () => {
	const body = `User-agent: *
Disallow:

Sitemap: ${siteOrigin()}/sitemap.xml
`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};
