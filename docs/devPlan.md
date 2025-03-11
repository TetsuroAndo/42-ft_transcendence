以下では、**ft_transcendence** プロジェクトを進めるにあたっての、典型的なディレクトリ構成・開発体制・モジュール／コンポーネントの開発計画を例示します。プロジェクト規模やチーム編成、選択モジュールの数によって柔軟に調整してください。

---

# 1. ディレクトリ構成例

本プロジェクトでは、**フロントエンド（TypeScript + Tailwind CSS）** と **バックエンド（Fastify + SQLite + マイクロサービス化）** を中心に、**WAF + Vault + ブロックチェーン + ELK/Prometheus** などを追加し、Docker で統合する構成を想定しています。

```
ft_transcendence/
├── backend/
│   ├── services/
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── ...
│   │   ├── game/
│   │   │   ├── game.controller.ts
│   │   │   ├── game.service.ts
│   │   │   └── ...
│   │   ├── tournament/
│   │   │   ├── tournament.controller.ts
│   │   │   ├── tournament.service.ts
│   │   │   └── ...
│   │   ├── chat/
│   │   │   ├── chat.controller.ts
│   │   │   └── ...
│   │   └── ...
│   ├── plugins/
│   │   ├── db.ts             # SQLite接続プラグインなど
│   │   ├── vault.ts          # Vault連携プラグイン
│   │   ├── ...
│   ├── middlewares/
│   │   ├── security.ts       # JWT検証, 2FA チェックなど
│   │   └── ...
│   ├── config/
│   │   ├── fastify.config.ts
│   │   ├── wss.config.ts
│   │   └── ...
│   ├── index.ts              # メインエントリ（Fastify 起動）
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── styles/
│   │   └── ...
│   ├── public/
│   ├── tailwind.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.js (or webpack.config.js など)
│
├── cli/
│   ├── src/
│   │   ├── cli_main.ts       # CLIエントリポイント
│   │   ├── api.ts            # API呼び出し用
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
│
├── blockchain/
│   ├── contracts/
│   │   ├── ScoreStorage.sol  # Solidityコントラクト例
│   │   └── ...
│   ├── scripts/
│   │   ├── deploy.ts         # テストネットへのデプロイ
│   │   ├── interact.ts       # コントラクト呼び出し
│   │   └── ...
│   └── truffle-config.js or hardhat.config.js  # 使用するフレームワークに応じて
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.cli
│   │   ├── Dockerfile.waf     # ModSecurity, WAF設定など
│   │   └── ...
│   ├── waf/
│   │   ├── modsecurity.conf
│   │   └── crs/
│   ├── vault/
│   │   ├── config.hcl
│   │   └── ...
│   ├── elk/
│   │   ├── elasticsearch/
│   │   ├── logstash/
│   │   └── kibana/
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── ...
│
├── docs/
│   ├── architecture.md
│   ├── design_ux.md
│   ├── modules_overview.md
│   └── ...
│
├── docker-compose.yml
├── .env.example
├── README.md
└── ...
```

### ディレクトリ構成のポイント

1. **backend/services/**
   - **UserService**、**GameService**、**TournamentService**、**ChatService**などの単位でフォルダを分割し、マイクロサービス化を見越した作りに。
2. **backend/plugins/**
   - Fastify プラグインとして、DB 接続や Vault 連携、認証用ミドルウェア等を切り出す。
3. **frontend/src/**
   - TypeScript + Tailwind CSS での SPA 実装。**pages** ディレクトリでルーティングを管理し、**components** で UI 部品を細分化。
   - i18n ディレクトリで多言語対応ファイルを管理。
4. **cli/**
   - Server-Side Pong の API と連携し、CLI から操作できる仕組みを提供。
5. **blockchain/**
   - Avalanche テストネットにデプロイする Solidity コントラクトや、Hardhat/Truffle スクリプト。
6. **infrastructure/**
   - Dockerfile、WAF 設定ファイル、Vault 設定、ELK、Prometheus/Grafana など、インフラ関連をまとめる。
7. **docs/**
   - 設計ドキュメントやアーキテクチャ概要をまとめる。

---

# 2. 開発体制と役割分担

チーム人数やスキルセットに応じて柔軟に変更してください。例として、5〜8 人程度でプロジェクトを行うケースを想定します。

| 役割                              | メイン担当内容                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| **プロジェクトリーダー / PM**     | 全体スケジュール・進捗管理、要件整理、モジュールの優先度決定                          |
| **アーキテクト**                  | システム全体の設計方針、ディレクトリ構成、モジュール間インターフェース統制            |
| **バックエンド担当(1〜2 名)**     | Fastify サーバ実装、DB 設計、API 設計、WebSocket、マイクロサービス化、Vault, WAF 設定 |
| **フロントエンド担当(1〜2 名)**   | TypeScript + Tailwind、SPA 実装、多言語対応、アクセシビリティ、(SSR があれば SSR)     |
| **Blockchain 担当**               | Solidity コントラクト作成、Avalanche テストネット連携、Vault で秘密鍵管理             |
| **DevOps/Infra 担当**             | Docker, docker-compose, CI/CD, ELK Stack, Prometheus/Grafana, Vault セキュリティ設定  |
| **ゲームロジック / 3D / AI 担当** | Pong ロジック、リモートプレイ実装、マルチプレイ、Babylon.js 3D、AI アルゴリズム       |
| **CLI 担当**                      | CLI アプリケーション開発、バックエンド API 統合                                       |

- ※ 上記はあくまでロールの一例であり、担当を兼任・分散する場合もあります。
- PM/アーキテクト/DevOps は全体横断的にサポート。

---

# 3. モジュールごとの開発計画（フェーズ）

下記は、どの順番でモジュールを開発していくかの一例です。チームの状況に合わせて前後は変えて構いません。

## フェーズ 0: 環境セットアップ

1. **Docker ベースのベース環境**
   - `docker-compose.yml` で、Fastify + SQLite + フロントエンド + WAF(最初は簡易設定) + Vault(初期設定) が立ち上がる最小構成
2. **リポジトリ構成 & 初期コード配置**
   - backend, frontend, cli, blockchain ディレクトリを準備
   - Linter, Formatter, Commit 規約など導入

## フェーズ 1: バックエンド・フロントエンドの最小実装

1. **バックエンド (Fastify + DB)**
   - UserService の簡易版 (ユーザー登録・認証のみ)
   - SQLite 接続テスト (docker 容器内でファイルを保持)
   - JWT or セッションの仮実装
2. **フロントエンド (TypeScript + Tailwind)**
   - SPA の土台 (ルーティング、簡易的なトップページ)
   - ベースデザイン (Tailwind)
3. **WAF(ModSecurity) の初期導入**
   - コンテナ起動時に Nginx + ModSecurity が動く構成をテスト

## フェーズ 2: ユーザーマネジメント + リモート認証 + 2FA/JWT

1. **標準的なユーザーマネジメント**
   - ユーザープロフィール, フレンド管理, アバター設定, 対戦履歴など
2. **リモート認証 (Google OAuth)**
   - フロント側ボタン → OAuth フロー → バックエンドでトークン検証
3. **2 段階認証 (2FA) & JWT**
   - JWT を使った API 保護
   - 2FA (TOTP/SMS/Email など) の導入

## フェーズ 3: Pong ゲームの実装 (サーバーサイド + マルチプレイ)

1. **サーバーサイド Pong (GameService)**
   - ゲームロジックをサーバーで管理 (WebSocket 通信)
   - 2 人対戦ができるように
2. **遠隔プレイヤー (Remote players)**
   - 別クライアントからの接続・操作を同期
3. **複数プレイヤー (3 人, 4 人...)**
   - マルチプレイロジック (コート形状やルール拡張)

## フェーズ 4: トーナメント管理 + ブロックチェーン連携

1. **トーナメント管理 (TournamentService)**
   - マッチメイキング, 順位管理, スコア保存
2. **ブロックチェーン (Avalanche) と Solidity**
   - トーナメントスコアの書き込み／取得
   - Vault で秘密鍵管理
3. **CLI で対戦**
   - CLI プログラムから Pong API 呼び出し → Web ユーザーと同じゲームに参加

## フェーズ 5: 追加ゲーム + ユーザー履歴・マッチメイキング拡張

1. **追加ゲーム (e.g. mini-game)**
   - ゲーム切り替え、各ゲームの対戦履歴を管理
2. **高度なマッチメイキング**
   - レーティングを用いた公平な対戦の自動マッチング

## フェーズ 6: ダッシュボード / GDPR / 多言語対応 / アクセシビリティ

1. **統計ダッシュボード**
   - Chart.js などで勝敗や各種 KPI をグラフ表示
2. **GDPR 対応**
   - アカウント削除、匿名化、Cookie/LocalStorage 管理
3. **多言語対応 (i18n)**
   - 3 言語以上の翻訳ファイル & 言語切り替え UI
4. **視覚障がい者向けアクセシビリティ**
   - ARIA 属性、スクリーンリーダー対応、高コントラスト、フォントサイズ調整

## フェーズ 7: 3D 表示 (Babylon.js) + SSR (必要に応じて)

1. **3D 化**
   - Babylon.js を用いて Pong フィールドを 3D で描画
   - 演出強化 (ライト、カメラアングル等)
2. **SSR 統合 (オプション)**
   - 初期ロード高速化、SEO 最適化

## フェーズ 8: DevOps 拡充 (ELK, Prometheus/Grafana)

1. **ログ管理 (ELK)**
   - ElasticSearch, Logstash, Kibana でログを可視化
2. **監視システム (Prometheus, Grafana)**
   - メトリクス収集 & アラート設定
3. **マイクロサービス化**
   - 各サービスを独立コンテナ化し、API や MessageQueue で疎結合
4. **ModSecurity ルールチューニング**
   - 攻撃パターンに合わせたカスタムルール

## フェーズ 9: 最終テスト & リリース

1. **統合テスト / 負荷テスト**
2. **ドキュメント・READ.me 整備**
3. **最終デモ / 評価準備**

---

# 4. 開発サイクルとマイルストーン

- **アジャイル / スクラム** 的に 1〜2 週間スプリントを回し、フェーズごとにマイルストーンを設定
- スプリント毎に**バックログ**を作成し、ユーザーストーリー・タスクを割り当て、プルリクベースでコードをレビュー
- 大きなモジュール導入の前後で**テクニカルリスク**を検証し、スパイク的な調査を行う

### 例: マイルストーン

1. **MS1**: 基本環境 & UserService の最低限実装・WAF セットアップ
2. **MS2**: ユーザーマネジメント & リモート認証 & 2FA/JWT
3. **MS3**: 基本 Pong (サーバーサイド) + Remote Play
4. **MS4**: トーナメント管理 & ブロックチェーン書き込み
5. **MS5**: CLI 対戦, 追加ゲーム, AI/Algo (必要なら)
6. **MS6**: ダッシュボード, GDPR, 多言語, アクセシビリティ
7. **MS7**: 3D 化, SSR
8. **MS8**: ログ監視インフラ (ELK/Prometheus), マイクロサービス化
9. **MS9**: 総合テスト & リリース

---

# 5. まとめと運用上のヒント

- **初期段階**で Docker とディレクトリ構成を固めておくと、後からの拡張（WAF, Vault, ELK など）がやりやすい。
- **モジュールごとの担当者**を決め、API インターフェース仕様をドキュメント化 (OpenAPI Spec など) し、整合性を保つ。
- **セキュリティ設定 (ModSecurity, Vault, JWT, 2FA)** は最初は大まかに導入し、後から強化・チューニングする方がスムーズ。
- **マイクロサービス化**は後半で着手しても良いが、早めにサービスの境界（user, game, tournament など）を想定した設計をするとリファクタが楽。
- **フロントエンドの SPA** は軽量ビルドツール（Vite など）＋ TypeScript / Tailwind CSS で進め、アーキ的に React / Vue 禁止の課題バージョンもあるため注意。
- **ブロックチェーン**はテストネット (Avalanche Fuji など) で開発し、接続情報や秘密鍵は Vault に保管。デプロイ/テストスクリプトをドキュメント化して共有する。

このように **ディレクトリ構成** で各コンポーネントを明確に分け、**開発フェーズごとの計画** を立てて進めることで、複数モジュールを実装する際の衝突や混乱を最小化できます。結果として最終的に要求要件をすべて満たし、Docker で容易に動く形にまとめることが可能となります。
