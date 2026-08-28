import { getLatestJournalEntries, getNextLive } from '$lib/cms/queries';
import type { PageServerLoad } from './$types';

// ビルド時（プリレンダー時）に一度だけSanityへ問い合わせる。
// 静的サイトなので、公開後の更新はSanity側のWebhook→Cloudflare Pages再デプロイで反映される。
export const load: PageServerLoad = async () => {
	const [nextLive, journalEntries] = await Promise.all([getNextLive(), getLatestJournalEntries(3)]);
	return { nextLive, journalEntries };
};
