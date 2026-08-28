import { getActiveCast } from '$lib/cms/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const cast = await getActiveCast();
	return { cast };
};
