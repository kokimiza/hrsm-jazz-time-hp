# デプロイ・運用手順

設計上の理由（なぜこの構成か）は [designs.md](./designs.md) §10。ここには「何をどこに設定するか」だけを書く。

## 目次

- [構成](#構成)
- 初回セットアップ
  - [Pages プロジェクトの設定](#pages-プロジェクトの設定)
  - [環境変数](#環境変数)
  - [自動デプロイ（Studio → サイト反映）](#自動デプロイstudio-で公開-サイトに反映)
  - [Studio 用の Sanity 設定](#studio-用の-sanity-設定)
  - [カスタムドメイン](#カスタムドメイン)
- 日常
  - [運営の方へ：サイトの更新のしかた](#運営の方へサイトの更新のしかた)
  - [ローカル開発](#ローカル開発)
  - [よくあるトラブル](#よくあるトラブル)
- 付録
  - [別の Cloudflare アカウントへの引き継ぎ手順](#別の-cloudflare-アカウントへの引き継ぎ手順)

---

## 構成

```
GitHubリポジトリ（1つ）
├── /         サイト本体（SvelteKit / 完全静的）  ── Cloudflare Pages プロジェクト①
└── studio/   Sanity Studio（運営用の管理画面）   ── Cloudflare Pages プロジェクト②
```

- 同じリポジトリから **Pages プロジェクトを2つ** 作る。Root directory で見る場所を分けているだけ。
- `studio/` は pnpm ワークスペースに **含めていない** 独立プロジェクト（依存は `studio/pnpm-lock.yaml` で別管理）。
- コンテンツ（ライブ・日誌）は Cloudflare ではなく **Sanity プロジェクト** に入っている。

---

## 初回セットアップ

### Pages プロジェクトの設定

| 項目                       | ① サイト本体 | ② Studio                 |
| -------------------------- | ------------ | ------------------------ |
| Framework preset           | None         | None                     |
| **Root directory**         | `/`（空欄）  | `studio`                 |
| Build command              | `pnpm build` | `pnpm exec sanity build` |
| **Build output directory** | `build`      | `dist`                   |

> **Root directory とBuild output directoryは別軸。混同注意。**
>
> - Root directory＝そのプロジェクトが**見にいくフォルダ**（リポジトリのどこをビルドするか）
> - Build output directory＝ビルドが**吐き出す場所**（そのフォルダの中のどこに完成品が出るか）
>
> ①は `build/` に出力（SvelteKitの`adapter-static`）、②は `dist/` に出力（Sanity CLIの既定）。組み合わせを取り違えると「ビルドは成功のに `Output directory "dist" not found` でデプロイだけ失敗する」という壊れ方をする。

- Studio の Build command は `npm run build` でも同じ（中身は `sanity build`）。
- **Node のバージョンは設定しない。** リポジトリの `.node-version`（`22.16.0`）が使われる。`NODE_VERSION` 環境変数は `.node-version` があると無視されるので、入れても意味がない。

### 環境変数

Cloudflare の各プロジェクト → Settings → Variables and Secrets で設定する。**Production に設定する**（Preview デプロイも使うなら Preview にも同じ値を入れる）。

**① サイト本体**

| 変数名                      | 必須 | 値                                                            |
| --------------------------- | :--: | ------------------------------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID`  |  ✅  | Sanity の Project ID                                          |
| `PUBLIC_SITE_URL`           |  ✅  | サイトの URL。末尾スラッシュなし（例: `https://example.com`） |
| `PUBLIC_SANITY_DATASET`     |      | 省略可（未設定でも `production` になる）                      |
| `PUBLIC_SANITY_API_VERSION` |      | 省略可（コード側の既定 `2026-08-28` が使われる）              |

**② Studio**

| 変数名                     | 必須 | 値                                       |
| -------------------------- | :--: | ---------------------------------------- |
| `SANITY_STUDIO_PROJECT_ID` |  ✅  | Sanity の Project ID（①と **同じ値**）   |
| `SANITY_STUDIO_DATASET`    |      | 省略可（未設定でも `production` になる） |

> ⚠️ ①と②で **変数名が違う**（`PUBLIC_SANITY_…` と `SANITY_STUDIO_…`）。値は同じ。取り違えると、ビルドは成功するのにサイトのライブ・日誌が空になる。

- Project ID は https://www.sanity.io/manage → 対象プロジェクトの画面上部に出ている。**`p`（アルファベット）と `8`（数字）が似ていて見間違えやすいので、貼り付けたら1文字ずつ照合する**（例：`3pobbpuv` と `38obbpuv` は別物）。
- 環境変数を追加・変更しただけでは反映されない。保存後に **再デプロイ**（Deployments → 最新 → Retry deployment）する。

### 自動デプロイ（Studio で公開 → サイトに反映）

```
Studio で Publish → Sanity Webhook → ①の Deploy Hook → ①が再ビルド（Sanityから最新データを取得）
```

1. **Cloudflare**：**①（サイト本体）** → Settings → Builds → Deploy hooks → Add deploy hook（名前は何でもよい）→ 発行された URL をコピー
2. **Sanity**：https://www.sanity.io/manage → 対象プロジェクト → API → Webhooks → Create webhook
   - URL：手順1の Deploy Hook URL
   - Dataset：`production`
   - Trigger on：Create / Update
   - Filter：`_type == "live" || _type == "journal"`
   - HTTP method：POST

> Deploy hooks を見るのは **①だけ**。②Studio は中身（管理画面のコード）が変わらない限り再ビルドの必要が無いので、Deploy Hook を作らない。「Sanity で公開してもサイトに反映されない」ときにまず開くのは①の Settings → Builds → Deploy hooks。

Deploy Hook の URL は **Pages プロジェクトごとに固有**。プロジェクトを作り直したら必ず Webhook の URL も差し替える。Webhook がちゃんと発火・成功しているかは、Sanity の Webhooks 画面 → 対象の Webhook → **実行履歴（Attempt log）** で確認できる（履歴が無ければ発火していない＝Filter/Trigger の設定ミス、履歴はあるが失敗していれば URL が古い）。

### Studio 用の Sanity 設定

- **CORS**：Sanity manage → 対象プロジェクト → API → CORS origins に、②の URL（`https://<project>.pages.dev` やカスタムドメイン）を **Allow credentials 有効** で追加する。これが無いと Studio がデータを読めない。①はビルド時にサーバー側から読むだけなので不要。
- **ログイン**：Studio には Sanity アカウントでログインする。更新する人は Sanity プロジェクトのメンバー（Members → Invite）になっている必要がある。

### カスタムドメイン

- ① → Custom domains → Set up a custom domain。ドメインが **同じ Cloudflare アカウント内のゾーン** なら DNS レコードは自動で作られる（ルートドメインも可。別アカウントのゾーンのルートドメインは付けられない）。
- 付けたら `PUBLIC_SITE_URL` をそのドメインに変えて再デプロイ（`sitemap.xml` / `robots.txt` の URL に使われる）。
- ② にもサブドメイン（例: `studio.example.com`）を付けるなら、その URL を Sanity の CORS にも追加する。

---

## 日常

### 運営の方へ：サイトの更新のしかた

コードを触る必要はない。**Studio で入力して Publish（公開）を押すと、数分で自動的にサイトに反映される。**

- **Live（ライブ）**：開催日・出演者・楽器・補足（任意）。出演者は **Cast に登録済みのミュージシャンから選ぶ** ので、初出演の人は先に Cast へ追加しておく。休みの日は「店休日」をオンにする。開催日を過ぎたものは自動で「過去のライブ」に移る。
- **Journal（日誌）**：タイトル・本文・カバー画像（任意）。URL と投稿日時は自動で決まる。
- 反映されないときは、まず **Publish を押したか** を確認する（下書き保存だけでは公開されない）。

### ローカル開発

```sh
# サイト本体
pnpm install
cp .env.example .env        # 値を入れなくてもビルドは通る（ライブ・日誌が空になる）
pnpm dev
pnpm build                  # 本番と同じ静的出力の確認

# Studio（ワークスペース外なので studio/ で個別に）
cd studio
pnpm install
cp .env.example .env
pnpm dev
```

### よくあるトラブル

| 症状                                                                                                       | 原因・対処                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Publish してもライブ・日誌が反映されない                                                                   | ①のビルドログ（Deployments → 最新 → View details）を見る。<br>・`[cms] PUBLIC_SANITY_PROJECT_ID が未設定です` → ①の環境変数が無い、または変数名の取り違え（`SANITY_STUDIO_…` ではなく `PUBLIC_SANITY_…`）<br>・`[cms] GROQクエリの取得に失敗しました` → Project ID / dataset の打ち間違い<br>・そもそもビルドが走っていない → Sanity Webhook の URL が今の Deploy Hook と一致しているか<br>・ブラウザのキャッシュが原因であることはまずない（ビルド時点の内容を静的 HTML にしているため） |
| ビルドは成功するのに `Output directory "dist" not found`（または `"build" not found`）でデプロイが失敗する | Build output directory の取り違え。①は `build`、②は `dist`。上の[表](#pages-プロジェクトの設定)を参照                                                                                                                                                                                                                                                                                                                                                                                     |
| Studio が `No project with the ID placeholder-project-id exists` と出る                                    | ②の `SANITY_STUDIO_PROJECT_ID` が未設定。設定して②を再デプロイ                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Studio は開くがデータが読めない・CORS エラー                                                               | Sanity の CORS origins に②の URL が無い（または Allow credentials が無効）                                                                                                                                                                                                                                                                                                                                                                                                                |
| ビルドが `node-build: definition not found: <バージョン>` で失敗する                                       | Cloudflare のビルドイメージに入っていない Node を要求している。`.node-version`（ルートと `studio/` の両方）をイメージ既定の `22.16.0` から変えないこと。上げる必要が出たら、先に designs.md §10 の依存関係の制約を確認する                                                                                                                                                                                                                                                                |
| 環境変数を変えたのに反映されない                                                                           | 保存しただけでは反映されない。再デプロイする                                                                                                                                                                                                                                                                                                                                                                                                                                              |

---

## 付録

### 別の Cloudflare アカウントへの引き継ぎ手順

Pages プロジェクトはアカウント間で移動できないので、**移行先で作り直す**。同じ GitHub リポジトリを2つのアカウントに同時につなぐことはできない（「別アカウントで使用中」で弾かれる）ため、**旧側を消してから新側を作る** 順番になる。

A = 移行元のアカウント、B = 移行先のアカウント。

1. **A の設定値を控える（削除前に必ず）**
   - ①②それぞれの Settings → Variables and Secrets の値
   - ①の Build 設定（上の表と同じか確認）
2. **A の Pages プロジェクトを2つとも削除する**
   - この時点で A の `*.pages.dev` は表示されなくなる。
   - Sanity Webhook は A の Deploy Hook を向いたままなので、手順7までの間に Studio で公開しても反映されない（データは消えない）。
3. **B で GitHub と連携する**
   - Workers & Pages → Create → Pages → Connect to Git → GitHub
   - GitHub 側の画面で **Only select repositories** を選び、このリポジトリだけを許可する（他のリポジトリを B から見えないようにする）。
4. **B で ① サイト本体を作る** → [Pages プロジェクトの設定](#pages-プロジェクトの設定)・[環境変数](#環境変数)の通りに入力 → デプロイ
   - `*.pages.dev` のサブドメインは A のときと同じ名前が取れるとは限らない。
5. **B で ② Studio を作る** → 同様に入力 → デプロイ
6. **カスタムドメイン** を①（必要なら②も）に付け、`PUBLIC_SITE_URL` を更新して①を再デプロイ
7. **①で Deploy Hook を作り、Sanity の Webhook の URL を差し替える**
8. **Sanity の CORS に②の新しい URL を追加**。更新する人を Sanity のメンバーに招待する。
9. **動作確認**：Studio にログイン → ライブを1件編集して Publish → 数分後にサイトに反映されるか見る

**GitHub アカウントについて**：移行後も、B のビルドは **元の持ち主の GitHub リポジトリ** を取りに行く。以下をすると、サイトは表示されたまま **更新だけが止まる**：

- リポジトリの削除・アクセスの変更
- GitHub 側で Cloudflare の連携アプリをアンインストール
- GitHub アカウントの削除

将来、移行先の人が自分の GitHub アカウントを持ったら、リポジトリを譲渡（Settings → Transfer ownership）し、B の Pages の Git 連携をつなぎ直せばこの依存はなくなる。
