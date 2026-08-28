import { getUpcomingLives } from '$lib/cms/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const lives = await getUpcomingLives();
	return { lives };
};
