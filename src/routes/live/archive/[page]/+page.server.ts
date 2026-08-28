import { error } from '@sveltejs/kit';
import { ARCHIVE_PAGE_SIZE, getPastLives, getPastLivesCount } from '$lib/cms/queries';
import type { EntryGenerator, PageServerLoad } from './$types';

// ページ1は `/live/archive` 側が担当するので、ここでは2ページ目以降だけを列挙する。
export const entries: EntryGenerator = async () => {
	const total = await getPastLivesCount();
	const totalPages = Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE));
	return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
		page: String(i + 2)
	}));
};

export const load: PageServerLoad = async ({ params }) => {
	const page = Number(params.page);
	if (!Number.isInteger(page) || page < 2) error(404, 'Not found');

	const total = await getPastLivesCount();
	const totalPages = Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE));
	if (page > totalPages) error(404, 'Not found');

	const lives = await getPastLives(page);
	return { lives, page, totalPages };
};
