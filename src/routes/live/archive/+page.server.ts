import { ARCHIVE_PAGE_SIZE, getPastLives, getPastLivesCount } from '$lib/cms/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [lives, total] = await Promise.all([getPastLives(1), getPastLivesCount()]);
	return { lives, page: 1, totalPages: Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE)) };
};
