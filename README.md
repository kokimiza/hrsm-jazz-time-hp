# JAZZTIME 広島 — サイト

設計は [doc/designs.md](./doc/designs.md) を参照。SvelteKit（`adapter-static`）+ Tailwind CSS v4 + Sanity（`/studio`）のpnpmモノレポ構成。

- サイト本体の環境変数：`.env.example` を `.env` にコピーし、Sanityのproject ID等を設定（未設定でもビルドは通り、CMSコンテンツが空の状態で出力される）
- Sanity Studioのセットアップ：[studio/README.md](./studio/README.md) 参照（`sanity login` 等、アカウントが必要な手順あり）

---

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.17.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography" mdsvex paraglide="languageTags:ja, en+demo:no" --install pnpm hrsm-jazz-time-hp
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
