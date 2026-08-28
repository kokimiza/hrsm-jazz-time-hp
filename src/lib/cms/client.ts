import { createClient, type SanityClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = env.PUBLIC_SANITY_API_VERSION || '2026-08-28';

/**
 * Sanityのproject IDが未設定の状態でもサイトのビルド/開発が壊れないようにする。
 * （Sanity側のプロジェクトをまだ作成していない開発初期や、CIでのプレビュービルド向け）
 * 本番運用ではCloudflare Pagesの環境変数に PUBLIC_SANITY_PROJECT_ID を設定すること。
 */
export const isCmsConfigured = Boolean(projectId);

if (!isCmsConfigured) {
	// これがビルドログに出ていない = 未設定が原因ではない。逆にこれが出ていたら
	// Cloudflare Pages側の環境変数 PUBLIC_SANITY_PROJECT_ID が本番環境に入っていない、という意味。
	// (未設定でもビルド自体は落とさず、全コンテンツが空のフォールバックになるだけなので気づきにくい)
	console.warn(
		'[cms] PUBLIC_SANITY_PROJECT_ID が未設定です。Live/Journalは常に空（フォールバック）として扱われます。'
	);
}

export const sanity: SanityClient | null = isCmsConfigured
	? createClient({
			projectId,
			dataset,
			apiVersion,
			// Sanityの投稿(publish) → Webhook → Cloudflare Pagesの即時リビルド、という構成では、
			// ビルドがCDN(apicdn.sanity.io)の反映（実測1〜2分程度のラグがあり得る）より先に走ることがある。
			// useCdn: true だとその間の古いキャッシュを読んでしまい、「デプロイは成功したのに中身が
			// 更新されていない」状態になる。ビルド時に一度だけ叩くだけなのでCDNの恩恵はほぼなく、
			// 常に最新を読める非CDN経由（api.sanity.io）に倒す。
			useCdn: false,
			perspective: 'published'
		})
	: null;

/**
 * GROQクエリを安全に実行する。CMS未設定・ネットワークエラー時はfallbackを返し、
 * ビルド全体を止めない（静的サイトなので、CMSが不調でも他のページは出したい）。
 */
export async function safeFetch<T>(
	query: string,
	params: Record<string, unknown>,
	fallback: T
): Promise<T> {
	if (!sanity) return fallback;
	try {
		return await sanity.fetch<T>(query, params);
	} catch (error) {
		console.warn(`[cms] GROQクエリの取得に失敗しました。fallbackを返します: ${query}`, error);
		return fallback;
	}
}
