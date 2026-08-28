import { createImageUrlBuilder } from '@sanity/image-url';
import { env } from '$env/dynamic/public';
import type { SanityImageRef } from './types';

const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

/** 画像URLを組み立てる。CMS未設定時はnullを返すので呼び出し側でフォールバック表示する。 */
export function urlFor(source: SanityImageRef | undefined | null, width = 1200) {
	if (!builder || !source?.asset) return null;
	return builder.image(source).width(width).fit('max').auto('format').url();
}
