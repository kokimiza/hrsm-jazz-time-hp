import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Cloudflare Pages上に「完全な静的サイト」としてデプロイする（サーバーランタイムなし）。
			// 全ページを prerender するため fallback は持たせない（strict: true が既定でそれを強制する）。
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter(),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md'],

			prerender: {
				// journal記事がまだ0件（Sanity未接続）の状態でも `pnpm build` を通す。
				// `/journal/[slug]` の entries() が実データを返すようになれば通常は発生しない。
				handleUnseenRoutes: 'warn'
			}
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// URLでロケールを判定する（/en/... 等）。cookie/baseLocaleはURLに手がかりがない場合のfallback。
			strategy: ['url', 'cookie', 'baseLocale']
		})
	]
});
