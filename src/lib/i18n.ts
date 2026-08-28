import type { Pathname } from '$app/types';
import { resolve } from '$app/paths';
import { localizeHref } from '$lib/paraglide/runtime';

/**
 * サイト内リンク用ヘルパー。現在のロケールに応じたURLを組み立てる
 * （src/routes/+layout.svelte のロケール切替リンクと同じ仕組み）。
 */
export function localePath(path: string) {
	return resolve(localizeHref(path) as Pathname);
}
