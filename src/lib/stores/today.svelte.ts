import { browser } from '$app/environment';
import { todayInJapan } from '$lib/format';
import type { LiveEntry } from '$lib/cms/types';

/**
 * 閲覧時点の「今日」（店の現地日付）。
 *
 * サイトは静的プリレンダーなので、ビルド時に「今後のライブ」を確定させると、
 * CMSの更新（＝再ビルド）が無いまま日付が変わったときに終わったライブが残り続けてしまう。
 * そこで「今後／過去」の境目はブラウザが閲覧時点の日付で決める。
 *
 * 日付は Promise で持ち、表示側は `{#await today.date}` で受ける。
 * プリレンダー時は永遠に解決しない Promise なので、HTMLには pending 側（ローディング表示）だけが焼き込まれ、
 * ビルド時点の（古いかもしれない）ライブは一瞬たりとも表示されない。ブラウザではハイドレーション直後に解決する。
 */
class TodayState {
	#current = browser ? todayInJapan() : null;

	date = $state<Promise<string>>(
		this.#current === null ? new Promise(() => {}) : Promise.resolve(this.#current)
	);

	/** 日付が変わっていたら取り直す（タブを開いたまま日をまたいだ場合用）。 */
	refresh() {
		const next = todayInJapan();
		if (next === this.#current) return;
		this.#current = next;
		this.date = Promise.resolve(next);
	}
}

export const today = new TodayState();

/** 開催日が閲覧日以降か。 */
export function isUpcoming(live: LiveEntry, date: string): boolean {
	return live.date >= date;
}
