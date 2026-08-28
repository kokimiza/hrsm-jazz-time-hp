import { base } from '$app/paths';
import { env } from '$env/dynamic/public';
import { localizeHref, locales } from '$lib/paraglide/runtime';

const FALLBACK_SITE_URL = 'https://jazztime.pages.dev';

/**
 * サイトの絶対オリジン。Cloudflare Pagesの環境変数 `PUBLIC_SITE_URL` を正とする。
 *
 * 本ドメインが未確定の間は、各Cloudflare Pagesプロジェクトの `https://<project>.pages.dev` を
 * ここに設定しておき、本ドメインへ切り替わったら値を差し替えるだけでよい
 * （sitemap.xml / robots.txt はこの値を元に自動で追従する）。
 * 未設定時（ローカルビルド等）はプレースホルダーにフォールバックし、ビルドを壊さない。
 */
export function siteOrigin(): string {
	const raw = env.PUBLIC_SITE_URL || FALLBACK_SITE_URL;
	return raw.replace(/\/+$/, '');
}

/**
 * 指定ロケールでの絶対URLを組み立てる（sitemap.xml / hreflang用）。
 *
 * 注意：`$app/paths` の `resolve()` はSSR中「現在描画しているページからの相対パス」を返す
 * （`<a href>` 用途向けの挙動）ため、サイトマップのような「現在のリクエストと無関係な
 * 絶対URLの一覧」を組み立てる用途には使えない。ここでは素の絶対パスをそのまま使う。
 */
export function absoluteLocalizedUrl(path: string, locale: (typeof locales)[number]): string {
	return `${siteOrigin()}${base}${localizeHref(path, { locale })}`;
}
