import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

// .env（studio/.env、SANITY_STUDIO_ プレフィックス）を参照する。
// 詳細: https://www.sanity.io/docs/studio/environment-variables
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
	console.warn(
		'[studio] SANITY_STUDIO_PROJECT_ID が未設定です。studio/.env.example を参考に studio/.env を作成してください。'
	);
}

export default defineConfig({
	name: 'jazztime',
	title: 'JAZZTIME Studio',
	projectId: projectId || 'placeholder-project-id',
	dataset,
	plugins: [structureTool(), visionTool()],
	schema: {
		types: schemaTypes
	}
});
