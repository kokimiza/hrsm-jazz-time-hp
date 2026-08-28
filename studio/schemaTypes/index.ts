import blockContent from './objects/blockContent';
import localeBlockContent from './objects/localeBlockContent';
import localeString from './objects/localeString';
import localeText from './objects/localeText';
import live from './live';
import journal from './journal';

export const schemaTypes = [
	// objects
	localeString,
	localeText,
	blockContent,
	localeBlockContent,
	// documents
	live,
	journal
];
