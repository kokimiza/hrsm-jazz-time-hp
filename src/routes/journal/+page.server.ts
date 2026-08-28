import { getAllJournalEntries } from '$lib/cms/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const entries = await getAllJournalEntries();
	return { entries };
};
