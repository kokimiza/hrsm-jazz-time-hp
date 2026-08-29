# JAZZTIME 広島 — サイト設計書 (v1)

> [concept.md](./concept.md) の内容を、実装可能な設計へ落とし込んだもの。
> 「システム」ではなく **静的サイト + ヘッドレスCMS(Sanity)** という前提で、page構成・コンテンツモデル・デザイン方針・デプロイ構成を定義する。

---

## 0. 前提・確定事項（今回のオーダーより）

| 項目             | 方針                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ホスティング     | Cloudflare Pages。ドメインは当面 `*.pages.dev` の仮ドメインでOK。将来、自社ドメインに差し替え                                                                     |
| CMS              | Sanity（ヘッドレス）。Studio管理UIも同じくCloudflare Pagesにホスト                                                                                                |
| リポジトリ構成   | pnpmモノレポ。ルート＝サイト本体、`/studio`＝Sanity Studio                                                                                                        |
| サイト⇄CMSの関係 | サイトはビルド時（＋必要なら実行時）にSanityの公開APIを叩くだけ。**サイト側に認証認可は一切持たない**（Studioへのログインのみで運営が完結）                       |
| 運営が触る範囲   | ライブスケジュールとブログ（日誌）の投稿のみ。他ページは静的コンテンツとしてコードで管理                                                                          |
| デザインの軸     | concept.md の「ジャズクラブの温かみ」は残しつつ、**クラシックな見やすさ・清潔感・明瞭さ**を優先。既定表示はダーク（ジャズクラブの夜の雰囲気を初回訪問時から出す）。ライト/ダークはヘッダーのトグルでいつでも手動切替できる設計（§8） |
| CSS              | Tailwind CSS v4（導入済み）                                                                                                                                       |
| レスポンシブ方針 | モバイルファースト。ただしPC幅でも間延び・崩れしないことを両立させる                                                                                              |

---

## 1. 技術スタック確定

既存の `package.json` / `vite.config.ts` をベースに、変更点だけ明記する。

| レイヤー        | 技術                                                  | 備考                                                            |
| --------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| フレームワーク  | SvelteKit 2 / Svelte 5 (runes)                        | 導入済み                                                        |
| スタイリング    | Tailwind CSS v4 + `@tailwindcss/typography`           | 導入済み。ブログ本文の装飾に typography プラグインを使う        |
| Markdown        | mdsvex                                                | `vite.config.ts`で`.svx`/`.md`拡張子を有効化済みだが、現状`src/routes`配下に`.svx`/`.md`ファイルは無く未使用（Aboutは表データをSvelteコンポーネントで直接組んでいる）。CMS本文はPortable Text |
| i18n            | `@inlang/paraglide-js`（ja / en）                     | 導入済み。ナビ文言・UIラベルはこちらで管理                      |
| CMS             | Sanity Studio（`sanity` ^6.11.0、`/studio`）           | 導入済み                                                        |
| CMSクライアント | `@sanity/client`（読み取り専用）                      | サイト側の依存として追加                                        |
| Adapter         | `@sveltejs/adapter-static`                            | 導入済み（`adapter-auto`から変更済み）。理由は §5 参照           |
| デプロイ        | Cloudflare Pages（サイト用・Studio用の2プロジェクト） | §10 参照                                                        |

---

## 2. リポジトリ構成（モノレポ）

```
hrsm-jazz-time-hp/
├── src/                      # サイト本体（既存）
│   ├── routes/
│   ├── lib/
│   │   ├── cms/              # Sanityクライアント・GROQクエリ・型
│   │   ├── components/
│   │   └── paraglide/
│   └── ...
├── messages/                 # 既存（ja.json / en.json）UI文言
├── studio/                   # 新規：Sanity Studio
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   ├── schemaTypes/
│   │   ├── live.ts
│   │   ├── cast.ts
│   │   ├── journal.ts
│   │   └── objects/
│   │       └── blockContent.ts
│   └── package.json
├── pnpm-workspace.yaml       # packages に studio を追加
└── doc/
    ├── concept.md
    └── designs.md            # 本書
```

`pnpm-workspace.yaml` に `studio` を追加：

```yaml
onlyBuiltDependencies:
  - esbuild
packages:
  - 'studio'
```

> Studioは作成済み（`studio/`、`sanity` ^6.11.0）。プロジェクトを作り直す場合は `npm create sanity@latest` の最新の対話式CLI（もしくは `--template clean` 等の非対話フラグ）を使う。手順は都度 [Sanity公式ドキュメント](https://www.sanity.io/docs/studio/installation) の最新版を確認すること（CLI仕様はメジャーバージョンごとに変わりうるため）。

---

## 3. サイトマップ / ルーティング

バー（飲食店）の小規模サイトとして、階層を作らずフラットに構成。詳細ページ・タブ・サブカテゴリはほぼ持たない（ライブのアーカイブのみページングあり）。

| ルート                 | 内容                                                                       | データソース                                | 備考                                                                                  |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/`                    | Home：Hero、次回ライブ、About抜粋、最新Journal（0件時は非表示）、Access抜粋 | 静的 + CMS（次回ライブ・Journal最新3件） | ファーストビューは concept.md の「JAZZTIME / LIVE JAZZ IN HIROSHIMA」を踏襲           |
| `/about`               | 案内（来店前の確認事項を表形式で1本化：営業時間・演奏時間・お支払い・定休日・セッションナイト） | 静的（Svelte）                              | 見出しは日本語で「ご案内」（ナビ表示も同様）。ラベル文言は`messages/*.json`（`about_*`）で管理。§4以下参照 |
| `/live`                | ライブスケジュール一覧（日付・出演者のみ。詳細ページなし）                 | CMS                                         | 今後の予定のみ、開催日昇順。末尾に過去ライブアーカイブへのリンク                      |
| `/live/archive`        | 過去ライブのアーカイブ（1ページ目）                                        | CMS                                         | 開催日が新しい順。1ページ12件でページング                                             |
| `/live/archive/[page]` | 過去ライブのアーカイブ（2ページ目以降）                                    | CMS                                         | `entries()`でページ数分をビルド時に列挙                                               |
| `/live/cast`           | キャスト（出演ミュージシャン）一覧                                         | CMS                                         | `active == true`のcastのみ表示。`/live`の上部からリンク。§4.2参照                     |
| `/journal`             | ブログ（日誌）一覧                                                         | CMS                                         | 「NEWS」から改称。§4.3 参照                                                           |
| `/journal/[slug]`      | 記事詳細                                                                   | CMS                                         | 一覧のみだと読み物として窮屈なため、Journalのみ詳細ページを残す                       |
| `/access`              | 住所・地図・営業時間・電話番号                                             | 静的                                        | Google Maps埋め込み。問い合わせ手段は電話番号のみなので、独立した`/contact`は作らない |

削除した項目（過剰だったため）：`/live/[slug]`（ライブ詳細）、`/menu`（ドリンク・フード）、`/contact`（独立の問い合わせページ）。理由と扱いは §4・§11 参照。`/live/archive`と`/musicians`相当の`/live/cast`は、どちらも当初「過剰」と判断し削除していたが、後日それぞれ「過去のライブもページングで見たい」「出演者を選択式にするならキャスト一覧ページも欲しい」との要望で復活させた。

各ルートは既存の paraglide 構成（`ja` をデフォルト、`en` を第二言語）にそのまま乗せる。ナビ文言・見出し等のUIコピーは `messages/*.json`で管理。CMSコンテンツ（Live / Journal）は翻訳せず日本語のみとする（§6）。

---

## 4. コンテンツモデル（Sanity スキーマ設計）

運営が触るのは **Live**・**Cast**・**Journal** の3つ。ライブは詳細ページを持たず、書く情報は「日付・出演者（キャスト参照＋楽器）・補足」のみに絞る（説明文・料金・予約導線などは今回は持たない＝運営の入力負担を最小化）。

出演者名は当初「独立ドキュメント型は用意せず、ライブごとの自由記述テキスト」としていたが、「毎回名前を手打ちするのがしんどい」という要望を受けて`cast`（キャスト）ドキュメント型を追加し、`live.performers[].cast`から参照する外部キー方式に変更した。楽器は人によって・ライブによって変わりうるため、`cast`側にはマスタ化せず、従来通りライブごとの自由記述のまま。

### 4.1 `live`（ライブ）

| フィールド                | 型              | 必須 | 備考                                                                                     |
| ------------------------- | --------------- | ---- | ---------------------------------------------------------------------------------------- |
| `date`                    | date            | 必須 | `/live`（今後の予定）はこの値でソート。過去分は`/live/archive`（§3）に別途表示           |
| `performers`              | array of object | 必須 | 各要素は`{ cast, instrument? }`                                                          |
| `performers[].cast`       | reference(cast) | 必須 | キャストマスタ（§4.2）への参照。名前はここから選ぶだけで、手打ちしない                   |
| `performers[].instrument` | string          | 任意 | 例: Piano / Bass / Drums / Sax / Vocal。表示は`name（instrument）`をサイト側で組み立てる |
| `note`                    | text            | 任意 | 補足欄。開場・開演時間など、書きたいことがあれば運営が自由に書く（項目は固定しない）     |

> サイト側のGROQでは`performers[]{ "name": cast->name, instrument }`のように参照先の名前をデリファレンスして取得し、表示コンポーネント（`PerformerList.svelte`等）は今まで通り`{ name, instrument }`の形のまま扱える＝スキーマ変更の影響をクエリ層に閉じ込めている。
> `performers`を単なる文字列配列（`"Alice(P)"`のような手打ち表記）にすると、名前と楽器を毎回1本の文字列で書く手間・表記ゆれが発生する。名前と楽器をフィールドとして分けることで、入力は「キャストを選ぶ」「楽器を書く」だけにし、`（　）`付きの表示形式はサイト側（`formatPerformer`, [src/lib/format.ts](../src/lib/format.ts)）で統一的に組み立てる。
> 開場時間・開演時間はフィールドとして固定で持たせず、`note`（補足）に書きたい場合だけ書く運用にする。料金・予約要否などは今回のスコープでは持たない。将来必要になれば `live` にフィールド追加すればよい（§12）。

### 4.2 `cast`（キャスト）

出演ミュージシャンのマスタ。運営がフォームで入力するのは「名前・有効/無効・（あれば）アイコン画像・説明文」だけ。

| フィールド | 型      | 必須 | 備考                                                                                  |
| ---------- | ------- | ---- | ------------------------------------------------------------------------------------- |
| `name`     | string  | 必須 |                                                                                       |
| `active`   | boolean | 必須 | 既定値`true`。`false`にすると`/live/cast`一覧から外れる（過去ライブの出演記録は残る） |
| `icon`     | image   | 任意 |                                                                                       |
| `bio`      | text    | 任意 |                                                                                       |

サイト側は`active == true`のキャストだけを`/live/cast`（§3）に一覧表示する。`live`側の`performers[].cast`参照はactiveに関わらずどのキャストでも選べる（過去の一時的な出演者を無効化しても、その人が出演した過去のLiveの表示は壊れない）。

### 4.3 `journal`（日誌／ブログ）

concept.md の「NEWS」をリネーム。運営が思ったことや出来事を綴る、日誌的な見出しにする。**日本語のみ**（英語版は持たない。§6参照）。運営がフォームで入力するのは実質「タイトル・本文・（あれば）カバー画像」だけで、URLと投稿日時は自動で決まる。

| フィールド   | 型            | 必須           | 備考                                                                                                   |
| ------------ | ------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| `title`      | string        | 必須           | 日本語のみ                                                                                             |
| `slug`       | slug          | 自動・入力不可 | ドキュメント作成時に日付+時刻から自動採番（例: `20260828-143205`）。`readOnly`にして運営には触らせない |
| `coverImage` | image         | 任意           | 一覧・OGP用。代替テキストは運営に入力させず、サイト側で固定文言（「ブログカバー」）を使う              |
| `body`       | Portable Text | 必須           | 画像埋め込み可                                                                                         |

削除した項目：`publishedAt`（Sanity標準の`_createdAt`をそのまま「投稿日時」として使う。運営に別途入力させない）、`tag`（不要と判断し廃止）、`excerpt`（一覧・詳細どちらも本文冒頭やタイトルで十分と判断し廃止）、`coverImage.alt`（運営に毎回書かせず固定文言に）。

> **見出し表記**：日本語「日誌」、英語 "JOURNAL" に確定（`messages/ja.json` / `messages/en.json` の `nav_journal` / `journal_page_heading`）。ナビでは "NEWS" ではなく上記のブログ/日誌トーンの語を採用している。

---

## 5. データ取得・ビルド方式（静的サイトの肝）

- 全ページ **ビルド時プリレンダー**（`export const prerender = true` をルート`+layout.ts`に指定）。実行時サーバーは持たない。
- `/journal/[slug]` のような動的ルートは `entries()` でビルド時にSanityから全slugを取得して列挙する（`live`に詳細ページはないので対象外）。
- `/live/archive/[page]` も同様に `entries()` を使う。過去ライブの総件数を`count()`クエリで取得し、1ページ12件（`ARCHIVE_PAGE_SIZE`）で割った残りページ数分（2ページ目以降）を列挙してビルド時に全ページ分の静的HTMLを書き出す。ページ1のみ`/live/archive`が別ルートとして担当し、実際の一覧・ページング表示は共通コンポーネント（`LiveArchiveView.svelte`）にまとめて重複を避けている。
- Sanityクライアントは読み取り専用（公開データのみを扱うため書き込みトークンは不要）。
- **`useCdn: false`** にする。ビルドはSanityの投稿(publish)をWebhookで即座に検知して走るが、Sanity CDN（`apicdn.sanity.io`）側の反映には1〜2分程度のラグがあり得るため、`useCdn: true`だとその間の古いキャッシュを読んでしまい「デプロイは成功したのに内容が更新されていない」状態になりうる。ビルド時に一度だけ叩くだけの用途ではCDNの恩恵（アクセス頻度に対するキャッシュ効果）もほぼないため、常に最新を返す非CDN経由（`api.sanity.io`）に倒す（[src/lib/cms/client.ts](../src/lib/cms/client.ts)）。
- **コンテンツ更新の反映**：Sanity側の「投稿（publish）」をフックに、**Sanityの Webhook → Cloudflare Pages の Deploy Hook** を叩いて自動再ビルドする（[Sanity公式ブログの解説](https://www.sanity.io/blog/deploying-a-next-js-site-on-cloudflare-pages-with-webhooks)と同様の構成）。運営は「投稿するだけ」で、数十秒〜数分後にサイトへ反映される。
- 上記の理由から Adapter は **`@sveltejs/adapter-static`** を採用する（`adapter-auto` から明示的に変更）。サーバーAPIルートを持たない今回のスコープでは、Workers実行環境（`adapter-cloudflare`）より軽量・単純で「単なる静的サイト」という要件に最も合う。将来、問い合わせフォームのサーバー処理やISR的な仕組みが必要になった場合は `adapter-cloudflare` への切替を検討する（§11/§12）。

### 5.1 sitemap.xml / robots.txt の自動生成

日誌（journal）は投稿するたびにページが増えていく。手作業でサイトマップを更新する運用にはしたくないので、`sitemap.xml`をビルド時にCMSへ問い合わせて自動生成する。ブログの内容が検索エンジンに拾われやすくする＝SEO対策そのもの。

- `src/routes/sitemap.xml/+server.ts`：`prerender = true`のエンドポイント。ビルドのたびに`getAllJournalEntries()`・`getPastLivesCount()`でSanityから最新の一覧・件数を取得し、固定ページ（`/` `/about` `/live` `/live/archive` `/live/cast` `/journal` `/access`）＋journal記事＋ライブアーカイブの各ページすべての`<url>`を書き出す。ja/en両ロケール分のURLを列挙し、`hreflang`の`alternate`リンクで互いを参照させる（多言語サイトのSEOのベストプラクティス）。
- `src/routes/robots.txt/+server.ts`：同じく`prerender = true`のエンドポイント（`static/robots.txt`は廃止しこちらに一本化）。`Sitemap: <サイトURL>/sitemap.xml`の1行を含めて出力する。
- 運用の流れ：**運営が日誌を投稿 → Sanity Webhookが発火 → Cloudflare Pagesが再ビルド → `sitemap.xml`も自動的に新しい記事を含んで再生成される。** 手動更新は一切不要。
- 絶対URLの組み立てには`PUBLIC_SITE_URL`環境変数（§10）を使う。仮ドメイン運用中も`*.pages.dev`のURLを設定しておけば動き、本ドメインに切り替わったら値を差し替えるだけでよい。
- 注：§6の通り`journal`本文は日本語のみになったため、`hreflang="en"`が指す`/en/journal/xxx`も実際には日本語のまま表示される（ページ自体は生成されるため404にはならない）。翻訳精度としては厳密ではないが、実害はないため許容する。

---

## 6. 多言語 (i18n)

- UIラベル・ナビ・固定ページ本文：既存の `paraglide-js`（`messages/ja.json` / `messages/en.json`）で管理。ここは引き続きja/en両対応。
- CMSコンテンツは**翻訳しない方針に変更**：`journal`（日誌）・`live`（出演者名など固有名詞中心）とも日本語のみを持つ。当初検討していたローカライズ用オブジェクト型（`localeString`等）は運営の入力負担が増える割に効果が薄いため廃止した。
  - ルーティング自体はja/en両ロケール分そのまま存在する（`/journal/xxx`と`/en/journal/xxx`が両方生成される）が、**中身の日誌本文は言語切替に追従せず常に日本語のまま表示される**。この差分は許容する。
- ルーティングは既存の `localizeHref` の挙動をそのまま踏襲。

---

## 7. デザイン方針

concept.mdのキーワード（Dark / Midnight / Smoke / Warm Light / Deep Red / Gold / Vintage）は活かしつつ、**飲食店として重要な「見やすさ・清潔感」を最優先**にする。ダークモード専用にはせず、ジャズクラブの温かみは「アクセントカラー・タイポグラフィ」に宿らせ、地の配色はライト/ダーク両対応で組む。アクセントは「黒いピアノ＋臙脂のベルベット＋暖色照明＋アンティークゴールド」のイメージを具体的な色に落とし込む（§7.1）。

### 7.1 カラー方針（トークンの考え方）

アクセントカラーは「臙脂〜バーガンディ」領域に確定。ピアノやステージにかかるベルベット／シルクの布を連想させる色で、黒背景・暖色照明・アンティークゴールドと組み合わせたときに"昔ながらのジャズバー感"が最も出る。

| トークン                           | ライト                                                                           | ダーク                                                                 |
| ---------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 背景（base）                       | アイボリー〜生成り系の明るいニュートラル                                         | チャコール〜黒に近いニュートラル（純黒は避け、わずかに暖色を効かせる） |
| 文字（ink）                        | ほぼ黒に近い濃い墨色（純黒は避ける）                                             | 明るいオフホワイト                                                     |
| アクセント（brand）                | `#641C24`（臙脂〜バーガンディ）                                                  | `#641C24`（同色。黒背景に映えるベルベット感の核）                      |
| アクセント（濃淡バリエーション）   | `#4A1118`（最も深い・強調/hover用）〜`#701F2A`（やや明るい・境界線や淡いタグ用） | 同左。パネルや強調ブロックの階調に使う                                 |
| セカンドアクセント（antique gold） | `#B08D57` 前後（真鍮・アンティークゴールド）                                     | 同色、または `#C6A664` 寄りにやや明るく（暖色照明のニュアンス）        |
| 罫線・区切り                       | 薄いグレー                                                                       | 薄い暖色寄りグレー                                                     |

**運用ルール**

- バーガンディ（`#641C24`系）は「本文の地色」には使わない。ボタン・見出し下線・カード/パネルの背景・タグ・ホバー状態など、"アクセント"としてのみ使用する（黒 or アイボリーの上に乗せてこそ効くベルベットの色なので、地の背景色に採用すると彩度・視認性の両面で扱いにくい）。
- アンティークゴールドはリンクのホバー、アイコン、細い罫線・装飾ラインなど「点」で使う。バーガンディと金を両方主役級に使うと重くなるため、面積比は バーガンディ＞ゴールド を基本とする。
- ライトモードでバーガンディをボタン等の塗りに使う場合、文字色は白〜アイボリーにしてコントラスト比（WCAG AA目安 4.5:1以上）を確保する。バーガンディを地色にした上に暗い文字を乗せない。
- 候補として挙がった他の臙脂系（`#5A1720` / `#701F2A` / `#4A1118`）は、上記の濃淡バリエーションとしてそのまま採用し、単色で終わらせず階調を作る。

→ 上記はTailwindの`@theme`で`--color-brand-*` / `--color-gold-*`のようなトークンとして定義し、実装時に微調整する。

### 7.2 タイポグラフィ

- 見出し：和文は明朝系（例：Zen Old Mincho 等）、欧文はセリフ（例：Cormorant / Playfair Display 等）で"ジャズクラブのポスター感"を軽く演出。
- 本文：可読性重視のゴシック/サンセリフ（例：Noto Sans JP + システムUIフォント）。
- 見出しは効果的に使うのみに留め、本文の可読性を絶対優先（飲食店サイトとして情報が伝わることが最重要）。
- **文字サイズ**：Tailwindの既定スケール（`text-xs`〜`text-9xl`）が実機で小さいと判断し、`@theme`で`--text-*`トークンを一律1.6倍にオーバーライドしている（[layout.css](../src/routes/layout.css)）。行間比率は無次元値なのでフォントサイズに追従、spacing（余白）のスケールは変えていないので、余白に対して文字が大きくなる形（＝結果的に情報密度は下がるが、それが狙い）。任意値（`text-[10px]`等）は自動追従しないため、使う場合は手動で1.6倍した値にする。

### 7.3 レイアウト原則

- 余白を惜しまない。罫線は細く上品に。
- 写真（店内・ライブ・ドリンク）を主役にできるグリッド／カード設計。
- 装飾よりも「今日/次回のライブ」「営業時間」「アクセス」「電話」がすぐ見つかることを優先。

### 7.4 グレイン（紙のざらつき感）

ジャズクラブのポスター・レコードジャケットのような手触りを、カード・ボタン・帯といった共通コンポーネントに薄く重ねる装飾。画像アセットは使わず、`feTurbulence`で生成した粒状ノイズ（SVG data URI）をCSSの`.grain`クラスとして定義し（[layout.css](../src/routes/layout.css)）、`LiveCalendar`・`JournalCard`・`LiveCard`・`Footer`・`Button`（primary）・Homeの帯セクションなど、繰り返し使われる面に適用している。

- `feTurbulence`だけだと低コントラストで「薄く灰色っぽいだけ」になり視認できないため、`feComponentTransfer`（linear, slope 4 / intercept -1.5）でコントラストを持ち上げ、実際に粒として見える濃淡にしている（実装時にスクリーンショットで検証して発覚した点）。
- ライトモードは`mix-blend-mode: multiply`（紙にインクが沈み込むような、暗い粒だけが乗る見え方）、ダークモードは`overlay`（暗い面の上でも粒が光を受けたように見える）を使い分け、不透明度もテーマごとに調整。
- 背景が透明・写真・地図（iframe）で覆われる箇所には付けても効果が出ないため対象から外している（Access のマップパネル等）。

---

## 8. ライト/ダーク切替の実装方針

Tailwind CSS v4はCSSファースト設定のため、`class`戦略のダークモードを明示的に定義する（[layout.css](../src/routes/layout.css)）。

```css
/* src/routes/layout.css */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@custom-variant dark (&:where(.dark, .dark *));
```

- `<html>` 要素に `.dark` クラスを付け外しすることでダークモードを切替。
- **2状態（light / dark）のみ**。当初検討していた「system」（`prefers-color-scheme`に追従する第3状態）は採用していない——バー営業時間帯の店舗サイトとして「常に暗めの雰囲気で見せたい」という意図から、**未選択時のデフォルトはOS設定に関わらず常にダーク**にしている（[theme.svelte.ts](../src/lib/stores/theme.svelte.ts)の`DEFAULT_MODE`）。
- 選択状態は`localStorage`のキー`jazztime-theme`に`'light'`または`'dark'`として保存する（それ以外の値・未設定はデフォルトのダーク扱い）。
- **FOUC（フラッシュ）防止**のため、`app.html` の `<head>` 内、CSS読み込みより前に同期のインラインスクリプトを置き、初回描画前にテーマを確定させる：

```html
<!-- src/app.html の <head> 内、他のscriptより前 -->
<script>
	(function () {
		try {
			var stored = localStorage.getItem('jazztime-theme');
			var resolved = stored === 'light' ? 'light' : 'dark';
			if (resolved === 'dark') document.documentElement.classList.add('dark');
		} catch (e) {}
	})();
</script>
```

  ストレージキー（`jazztime-theme`）は[theme.svelte.ts](../src/lib/stores/theme.svelte.ts)の`THEME_STORAGE_KEY`と二重管理のため、変更する場合は両方を揃えること（コード側にもその旨のコメントあり）。

- ヘッダーに[ThemeToggle.svelte](../src/lib/components/ThemeToggle.svelte)（ライト⇄ダークのアイコン1つのトグルボタン。月/太陽アイコンで現在の状態を示す）を設置。押すたびに`light`/`dark`を反転し、`localStorage`へ即保存する。システム設定の変化を監視する`matchMedia`の`change`購読は持たない（システム追従自体を機能として持たないため）。

---

## 9. レスポンシブ / モバイルファースト方針

- Tailwindの無prefixクラスをモバイル基準とし、`sm:` `md:` `lg:` で段階的に拡張（Tailwind標準のモバイルファースト思想をそのまま採用）。
- PC幅では本文コンテナに`max-width`（例：`max-w-5xl`〜`max-w-6xl`程度）を持たせ、間延び・行長過多を防ぐ。
- 優先順位は「①今日・次回のライブ ②電話番号 ③営業時間・場所 ④出演者 ⑤店内の雰囲気（写真）」。モバイルのファーストビュー〜スクロール順にそのまま反映する。
- モバイルでは「ライブ／電話（`tel:`リンク）／アクセス」への画面下部固定クイックバー（[MobileQuickBar.svelte](../src/lib/components/MobileQuickBar.svelte)、3カラムグリッド）を実装済み。PCでは通常のヘッダーナビで代替できるため、`md:hidden`でモバイルのみ表示する。`env(safe-area-inset-bottom)`分の余白を確保し、iOSのホームインジケーターと重ならないようにしている。

---

## 10. デプロイ構成（Cloudflare Pages）

同一GitHubリポジトリから、**Cloudflare Pagesプロジェクトを2つ**作成する（モノレポの「Root directory」機能を使う）。

| プロジェクト  | Root directory    | ビルドコマンド           | 出力ディレクトリ                      | 用途            |
| ------------- | ----------------- | ------------------------ | ------------------------------------- | --------------- |
| サイト本体    | `/`（デフォルト） | `pnpm build`             | `build`（`adapter-static`の既定出力） | 一般公開サイト  |
| Sanity Studio | `studio`          | `pnpm exec sanity build` | `dist`                                | 運営用CMS管理UI |

- どちらも初期は各プロジェクトの `*.pages.dev` ドメインで運用し、本ドメイン確定後にカスタムドメインを割り当てる。
- Studio側は「非公開でよい」なら Cloudflare Pages側のアクセス制御（Cloudflare Access等）や、単純に**URLを公開しない運用**でも良い。認証はSanity自体のログイン（Google/メール等）に委ねる。
- **自動反映**：SanityのWebhook設定（Publish時発火）→ サイト本体プロジェクトのDeploy Hook URLを登録。運営がStudioで投稿・公開するだけでサイトが自動的に再ビルド＆再デプロイされる。
- 環境変数（サイト側）：`PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` / `PUBLIC_SANITY_API_VERSION`（日付形式）。公開データのみを扱うため書き込みトークンは持たない。
  - `PUBLIC_SITE_URL`：サイトの絶対オリジン（`sitemap.xml` / `robots.txt`用、§5.1）。仮ドメイン運用中は当該Cloudflare Pagesプロジェクトの`https://<project>.pages.dev`を設定し、本ドメイン確定後に差し替える。
- **Node.jsバージョン**：`pnpm install` はモノレポ全体（サイト本体＋studio）を一括で解決するため、Root directoryが`/`のサイト本体プロジェクトでも、studio側の依存関係（Sanity CLIが内部で使う`skills`パッケージ、`engines.node: >=22.20.0`）の制約を受ける。Cloudflare Pagesの現行ビルドイメージ（v3）は `package.json` の `engines` を見て自動選択してはくれないため、**両方のCloudflare Pagesプロジェクトで環境変数 `NODE_VERSION` を明示的に設定すること**（Settings → Environment variables）。
  - 設定値は **`24.20.0`（Node 24系・Active LTS）を推奨**。`>=22.20.0`という最低ラインだけを満たすなら22系でも動くが、22系は既にMaintenance LTS（EOL 2027-04、あと半年程度）で近いうちに再度メンテが必要になる。24系はActive LTS（EOL 2028-04）で当面いじらずに済む。26系はまだCurrent（LTSは2026-10〜）で、この時点で本番に固定するには時期尚早。
  - リポジトリには目安として `.node-version`（`24.20.0`）を置いてあるが、Root directoryがサブディレクトリ（`studio`）の場合に確実に拾われる保証はないため、確実なのは上記の環境変数設定。

---

## 11. 今回のスコープ外（意図的に外した機能）

- **認証認可**：サイト側には一切実装しない。Studioへのログインのみで運営が完結する設計。
- **問い合わせページ／フォーム**：独立した`/contact`は作らない。問い合わせ手段は電話番号のみとし、`/access`（およびヘッダー/フッター・モバイル固定バー）に`tel:`リンクとして置く。
- **ライブ詳細ページ**：`/live`一覧（日付・出演者・任意の補足）のみで完結させ、個別の詳細ページ・説明文・料金・予約導線は持たない。
- **Menu（ドリンク・フード）**：ページ自体を今回は作らない。
- **About / Access のCMS化**：更新頻度が低いため、v1はコードで管理する静的コンテンツとする。

---

## 12. 今後の拡張候補（v1では見送り）

- `siteSettings`（singleton）を追加し、営業時間・電話番号などをCMS管理に移行（現状は静的コンテンツとして実装）。
- `/menu`（ドリンク・フード）ページとMenuドキュメント型の追加。
- ライブに詳細ページ・料金・予約導線を持たせる拡張（`live`へのフィールド追加＋`/live/[slug]`の新設）。
- 独立した問い合わせ手段が必要になった場合の外部フォームSaaS埋め込み、または`adapter-cloudflare`への切替。
- 下書きプレビュー（公開前のコンテンツをサイト側の見た目で確認できる環境。Sanity Presentation等）。なお`visionTool`はGROQクエリのデバッグ用として既にStudioに導入済みだが（[sanity.config.ts](../studio/sanity.config.ts)）、これは下書きプレビューとは別機能。
- ステージング用データセットの分離。

---

## 13. 未決事項（要確認・要決定）

- Sanityのプロジェクト作成（project ID / dataset名の確定。datasetは当面 `production` のみを想定。`.env.example`は現状project ID未設定のプレースホルダーのまま）
- Cloudflare Pages 2プロジェクトの名称
- 本ドメイン（決まり次第、両プロジェクトのカスタムドメイン設定を追加し、サイト側の`PUBLIC_SITE_URL`を差し替える。`.env.example`には仮の`https://hiroshima-jazztime.pages.dev`を置いている）
