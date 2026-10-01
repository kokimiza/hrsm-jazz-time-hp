import { getLatestJournalEntries, getUpcomingLives } from '$lib/cms/queries';
import type { PageServerLoad } from './$types';

// ビルド時（プリレンダー時）に一度だけSanityへ問い合わせる。
// 静的サイトなので、公開後の更新はSanity側のWebhook→Cloudflare Pages再デプロイで反映される。
export const load: PageServerLoad = async () => {
	const [lives, journalEntries] = await Promise.all([
		getUpcomingLives(),
		getLatestJournalEntries(3)
	]);
	return { lives, journalEntries };
};
