# JAZZTIME 広島 — サイト

広島・流川のジャズバー「JAZZTIME」の公式サイト。SvelteKit（完全静的サイト）+ Sanity（ヘッドレスCMS）+ Cloudflare Pagesで構成。設計の詳細・決定理由は [doc/designs.md](./doc/designs.md) を参照。

---

## 運営の方へ：更新のしかた

サイトのコードを触る必要はありません。**Sanity Studio（管理画面）から投稿するだけで、数十秒〜数分後に自動でサイトに反映されます。**

1. Studioの管理画面URLにログインする
2. 「Live」でライブスケジュールを追加、または「Journal」で日誌を書く
3. 内容を入力したら **Publish（公開）** を押す

これだけです。裏側では「Publish → Sanityが変更を検知 → サイトの再ビルド・再デプロイが自動で走る」という仕組みが動いています（下の「自動デプロイの仕組み」参照）。

- **Live（ライブ）**：入力するのは「開催日」「出演者（名前・楽器）」「補足（任意）」だけ。開催日が過ぎたものは自動的に一覧から消え、`/live/archive` の過去ライブ一覧に移ります。URLや投稿順は考えなくてOK。
- **Journal（日誌）**：「タイトル」「本文」「カバー画像（任意）」だけ。URL・投稿日時は自動で決まるので空欄のままでよい欄があっても気にしないでください。
- 反映されたか不安なときは、ブラウザのキャッシュを疑う前に**Publishを押したか**を確認してください（下書き保存だけでは公開されません）。数分待っても変わらない場合は開発者に連絡してください（「デプロイのログを見てほしい」で伝わります）。

---

## アーキテクチャ

```
kokimiza/hrsm-jazz-time-hp （1つのGitHubリポジトリ、pnpmモノレポ）
├── サイト本体（このディレクトリ）── SvelteKit / adapter-static ── Cloudflare Pages ①
└── studio/                    ── Sanity Studio（管理画面）    ── Cloudflare Pages ②
```

- サイト本体は**完全に静的**（サーバーを持たない）。ビルド時にSanityへ問い合わせて全ページをHTML化する。
- Studioは運営が使う入力フォーム（Sanity管理画面）で、それ自体もCloudflare Pagesにホストしている別プロジェクト。
- 2つは同じリポジトリの別ディレクトリを見ているだけで、実行時には互いに直接通信しない（サイトはビルド時にSanityのAPIを叩くだけ）。

## 自動デプロイの仕組み

```
Studioで Publish
      │
      ▼
Sanity Webhook が発火（対象: live / journal の変更）
      │
      ▼
Cloudflare Pages の Deploy Hook を叩く
      │
      ▼
サイト本体プロジェクトが再ビルド（Sanityから最新データを取得してHTML化）
      │
      ▼
再デプロイ完了（sitemap.xmlも新しい記事を含めて自動更新される）
```

設定済みなので通常は意識不要。設定そのものを作り直す場合は「初回セットアップ」を参照。

---

## 開発者向け：ローカル開発

```sh
pnpm install                # ワークスペース全体（サイト本体 + studio）を一括インストール
cp .env.example .env        # Sanityのproject ID等を設定（未設定でもビルドは通り、CMSは空の状態になる）

pnpm dev                    # サイト本体の開発サーバー
pnpm --filter studio dev    # Studioの開発サーバー（別ターミナルで）

pnpm build                  # 本番ビルド（Cloudflare Pagesと同じ`adapter-static`出力を確認したいとき）
pnpm check                  # 型チェック
pnpm lint                   # prettier + eslint
```

Studio自体の初回セットアップ（Sanityアカウントでのログイン等、人が一度だけ行う手順）は [studio/README.md](./studio/README.md) を参照。

### 環境変数

サイト本体（このディレクトリ）の `.env` / Cloudflare Pagesの環境変数：

| 変数名                      | 内容                                                           |
| --------------------------- | -------------------------------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID`  | SanityのプロジェクトID                                         |
| `PUBLIC_SANITY_DATASET`     | 通常`production`                                               |
| `PUBLIC_SANITY_API_VERSION` | 省略可（コード側の既定値が使われる）                           |
| `PUBLIC_SITE_URL`           | サイトの絶対URL。`sitemap.xml`/`robots.txt`の絶対URL生成に使う |

> ⚠️ **`studio/.env`の変数名とは異なる**（studio側は `SANITY_STUDIO_PROJECT_ID`）。値（project ID）は同じものを、変数名だけ変えてそれぞれに設定する。名前を間違えると、ビルド自体は成功するのにLive/Journalが常に空になる（下の「よくあるトラブル」参照）——実際に一度これで詰まったので、`.env.example`にもコメントを残してある。

---

## 初回セットアップ（Cloudflare Pages）

同じGitHubリポジトリから、Cloudflare Pagesプロジェクトを**2つ**作る。

| プロジェクト  | Root directory | ビルドコマンド           | 出力ディレクトリ | 環境変数                                                                      |
| ------------- | -------------- | ------------------------ | ---------------- | ----------------------------------------------------------------------------- |
| サイト本体    | `/`（既定）    | `pnpm build`             | `build`          | 上表の`PUBLIC_*`一式 + `NODE_VERSION=24.20.0`                                 |
| Sanity Studio | `studio`       | `pnpm exec sanity build` | `dist`           | `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` + `NODE_VERSION=24.20.0` |

`NODE_VERSION`について：モノレポ全体（studioを含む）の依存関係がNode 22.20以上を要求するため、Root directoryが`/`のサイト本体プロジェクトでも明示的に設定が必要（詳細は[doc/designs.md §10](./doc/designs.md)）。

### Sanity Webhook → Cloudflare Deploy Hook の設定

1. **Cloudflare側**：サイト本体プロジェクト → `Settings` → `Builds` → `Add deploy hook` でURLを発行
2. **Sanity側**：`sanity.io/manage` → 対象プロジェクト → `API` → `Webhooks` → `Create webhook`
   - URL：①のDeploy Hook URL
   - Dataset：`production`
   - Trigger on：Create / Update
   - Filter（GROQ）：`_type == "live" || _type == "journal"`（無関係な変更で毎回ビルドされないように絞る）

これで「Studioで公開 → 自動デプロイ」が動くようになる。

---

## よくあるトラブル

**投稿してもLive/Journalが反映されない**

1. Cloudflare Pages（サイト本体プロジェクト）のビルドログを開く
2. `[cms] PUBLIC_SANITY_PROJECT_ID が未設定です` が出ていたら → 環境変数が入っていない、または変数名を間違えている（Studio側の`SANITY_STUDIO_PROJECT_ID`とは別物）
3. `[cms] GROQクエリの取得に失敗しました` が出ていたら → project ID/datasetのtypo、またはStudio側でまだPublishしていない
4. デプロイ自体は成功しているのに内容だけ古い、というときは大抵上記のどちらか。**ブラウザのキャッシュが原因であることはまずない**（このサイトはビルド時に一度だけデータを取得して静的HTMLを書き出す方式なので、キャッシュを消しても「ビルドされた時点の内容」が変わるわけではない）

**Studioが `No project with the ID placeholder-project-id exists` と出す**

`SANITY_STUDIO_PROJECT_ID`が未設定のまま動いている（[studio/sanity.config.ts](./studio/sanity.config.ts)のフォールバック値）。Studio用Cloudflare Pagesプロジェクトの環境変数を確認。

**環境変数を追加・変更したのに反映されない**

Cloudflare Pagesは環境変数を保存した時点で動いているビルドには反映しない。保存後、もう一度デプロイし直す（空コミットのpushでも、ダッシュボードの「Retry deployment」でもよい）。

---

## もっと詳しく

- [doc/concept.md](./doc/concept.md)：サイトの企画・コンテンツ整理
- [doc/designs.md](./doc/designs.md)：技術設計（サイトマップ、Sanityスキーマ、デザイン方針、デプロイ構成など、意思決定の理由まで含む）
- [studio/README.md](./studio/README.md)：Sanity Studioの初回セットアップ・CORS設定など
