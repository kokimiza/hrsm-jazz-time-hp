import { fileURLToPath } from 'node:url';
import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

// studio/tsconfig.json の絶対パス。
// Viteの解決器はtsconfigを見つけるまで親ディレクトリを遡るため、放っておくと
// リポジトリルートの tsconfig.json を拾ってしまう。ルート側はSvelteKitが生成する
// `./.svelte-kit/tsconfig.json` をextendsしており、そのファイルは `svelte-kit sync`
// （サイト本体の `prepare`）を実行しないと存在しない。studioは独立プロジェクトなので
// その生成が走らず、Cloudflareのstudioビルドだけが "Tsconfig not found" で落ちていた。
// 明示的に固定して、studioのビルドがサイト本体の設定に一切依存しないようにする。
const tsconfig = fileURLToPath(new URL('./tsconfig.json', import.meta.url));

export default defineCliConfig({
	api: {
		projectId: projectId || 'placeholder-project-id',
		dataset
	},
	vite: (config) => ({
		...config,
		tsconfig
	})
});
