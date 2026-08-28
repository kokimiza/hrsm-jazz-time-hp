# JAZZTIME Studio（Sanity）

サイト本体（リポジトリルート）と同じpnpmモノレポ内のSanity Studio。設計は [../doc/designs.md](../doc/designs.md) を参照。

## 初回セットアップ（要Sanityアカウント。ここだけは人が行う必要あり）

```sh
pnpm install                       # リポジトリルートで（ワークスペース全体がインストールされる）
pnpm --filter studio exec sanity login
pnpm --filter studio exec sanity init --env   # 既存プロジェクトを作らず、対話式でプロジェクト作成 → .env に書き込み
```

`sanity init --env` を使うと、選んだprojectId/datasetが `studio/.env` に `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` として書き込まれる（`.env.example` を参考に手動で書いてもよい）。

CLIを使わず https://www.sanity.io/manage からブラウザ操作だけでプロジェクト作成しても良い（Create project → datasetは`production`という名前で作成 → 表示されるProject IDを控える）。

サイト本体側にも同じprojectId/datasetを反映すること（リポジトリルートの `.env`、`.env.example` 参照）。

### Cloudflare Pagesにデプロイする場合

ローカルの `.env` に加えて、**Cloudflare Pagesの両プロジェクトの環境変数にも同じ値を設定する**必要がある（`.env`はビルドサーバーには反映されない）。

- Studio用プロジェクト: `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`
- サイト本体プロジェクト: `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET`

設定を忘れると、デプロイ済みのStudioが `No project with the ID placeholder-project-id exists` のようなエラーを出す（[sanity.config.ts](./sanity.config.ts)のフォールバック値のまま動いている状態）。

また、StudioはブラウザからSanity APIを直接叩くため、**manage.sanity.io → 対象プロジェクト → API → CORS Origins** にStudioのデプロイURL（`*.pages.dev`や独自ドメイン）を「Allow credentials」有効で追加しておくこと。サイト本体側はビルド時にNode側から叩くだけなのでCORS設定は不要。

環境変数を追加・変更した後は、両プロジェクトとも再デプロイ（Retry deployment）しないと反映されない。

## 開発

```sh
pnpm --filter studio dev
```

## UI言語

管理画面（Studio）は `@sanity/locale-ja-jp` により日本語化済み（[sanity.config.ts](./sanity.config.ts)）。運営がStudioを操作するときのメニュー・ボタン等の表示言語で、サイト本体の表示言語（ja/en、paraglide側）とは別物。

## デプロイ

Cloudflare Pagesにデプロイする場合は、CFプロジェクトの Root directory を `studio`、ビルドコマンドを `pnpm exec sanity build`、出力ディレクトリを `dist` に設定する（詳細は [../doc/designs.md](../doc/designs.md) §10）。

Sanity公式ホスティング（`*.sanity.studio`）を使うだけでよければ `pnpm --filter studio deploy` でも公開できる。
