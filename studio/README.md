# JAZZTIME Studio（Sanity）

サイトの管理画面（Sanity Studio）。リポジトリ内にあるが pnpm ワークスペースには含めていない独立プロジェクトなので、コマンドはこのディレクトリで実行する。

デプロイ設定・環境変数・CORS は [../doc/deploy.md](../doc/deploy.md)、設計は [../doc/designs.md](../doc/designs.md) を参照。

## 初回セットアップ（要 Sanity アカウント）

```sh
cd studio
pnpm install
pnpm exec sanity login
pnpm exec sanity init --env   # 対話式でプロジェクト作成 → studio/.env に書き込み
```

`sanity init --env` を使わず、https://www.sanity.io/manage でプロジェクトを作って（dataset 名は `production`）、`.env.example` を参考に `studio/.env` を手で書いてもよい。サイト本体側（リポジトリルートの `.env`）にも同じ Project ID を入れる。

## 開発

```sh
cd studio
pnpm dev
```

## UI 言語

管理画面は `@sanity/locale-ja-jp` で日本語化している（[sanity.config.ts](./sanity.config.ts)）。サイト本体の表示言語（ja/en）とは別物。
