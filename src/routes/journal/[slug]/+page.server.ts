import { error } from '@sveltejs/kit';
import { getAllJournalSlugs, getJournalEntryBySlug } from '$lib/cms/queries';
import type { EntryGenerator, PageServerLoad } from './$types';

// プリレンダー対象のslugをビルド時に列挙する。
export const entries: EntryGenerator = async () => {
	const slugs = await getAllJournalSlugs();
	return slugs.map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const entry = await getJournalEntryBySlug(params.slug);
	if (!entry) error(404, 'Not found');
	return { entry };
};
