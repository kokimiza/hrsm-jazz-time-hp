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

export const sanity: SanityClient | null = isCmsConfigured
	? createClient({
			projectId,
			dataset,
			apiVersion,
			useCdn: true,
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
