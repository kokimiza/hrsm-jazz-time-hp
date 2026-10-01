import {
	ARCHIVE_PAGE_SIZE,
	getPastLives,
	getPastLivesCount,
	getUpcomingLives
} from '$lib/cms/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// upcoming はビルド時点では「今後」のライブ。閲覧時点で過ぎていた分を1ページ目の先頭に足すために渡す
	// （次の再ビルドまで、スケジュールにもアーカイブにも出ない空白期間を作らない）。
	const [lives, total, upcoming] = await Promise.all([
		getPastLives(1),
		getPastLivesCount(),
		getUpcomingLives()
	]);
	return {
		lives,
		upcoming,
		page: 1,
		totalPages: Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE))
	};
};
