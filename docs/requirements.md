# 要求要件定義書

## 1. プロジェクト概要

本プロジェクトは、オンライン対戦型の「Pong」ゲームを中心としたウェブアプリケーションを構築・拡張するものです。

- ユーザーがリアルタイムで対戦できる基本的な Pong ゲームを提供する
- モジュール（追加機能）を組み合わせることで、ユーザー管理、ブロックチェーン統合、セキュリティ強化など高度な機能を実装する
- 最終的には Docker コンテナ上でワンコマンド起動が可能な形で提供する

本要件定義書では、以下に示す **Major module** および **Minor module** を含む形での要件を定義します（それぞれのモジュールにおける詳細要件を後述します）。

---

## 2. 実装予定モジュール一覧

### 2.1. Web 関連

1. **(Major)** フレームワークを使用したバックエンド構築
2. **(Minor)** フロントエンド構築のためのフレームワーク／ツールキットの使用
3. **(Minor)** バックエンドでのデータベース使用
4. **(Major)** ブロックチェーン上にトーナメントのスコアを保存

### 2.2. User Management 関連

5. **(Major)** 標準的なユーザーマネジメント、認証、トーナメントをまたいだユーザー管理
6. **(Major)** リモート認証の実装

### 2.3. Gameplay and User Experience 関連

7. **(Major)** 遠隔プレイヤー（Remote players）
8. **(Major)** 2 人を超えるプレイヤー（マルチプレイヤー）
9. **(Major)** 追加ゲーム（ユーザーヒストリーとマッチメイキングを含む）
10. **(Minor)** ユーザーおよびゲーム統計ダッシュボード

### 2.4. Cybersecurity 関連

11. **(Major)** WAF/ModSecurity の導入（強化設定）と HashiCorp Vault による秘密情報管理
12. **(Minor)** GDPR 対応（ユーザー匿名化、ローカルデータ管理、アカウント削除）
13. **(Major)** 2 段階認証 (2FA) と JWT の実装

### 2.5. DevOps 関連

14. **(Major)** ログ管理のためのインフラ整備
15. **(Minor)** 監視システム
16. **(Major)** バックエンドのマイクロサービス化

### 2.6. Graphics 関連

17. **(Major)** 高度な 3D 表現技術

### 2.7. Accessibility & Multi-Platform 関連

18. **(Minor)** あらゆるデバイスでの利用サポート
19. **(Minor)** ブラウザ互換性の拡張
20. **(Minor)** 多言語対応
21. **(Minor)** 視覚障がい者向けアクセシビリティ機能
22. **(Minor)** サーバーサイドレンダリング（SSR）統合

### 2.8. Server-Side Pong 関連

23. **(Major)** 基本 Pong をサーバーサイドに置き換え、API を実装
24. **(Major)** CLI で Web ユーザーと対戦（API 統合）

---

## 3. 全体要件

### 3.1. 全体機能要件

1. **基本ゲーム機能（Pong）**

   - ユーザーがブラウザ上でリアルタイム対戦型 Pong を遊べる
   - トーナメント形式で複数プレイヤーの対戦管理ができる
   - シンプルな登録システムを実装（標準ユーザーマネジメントを導入する場合は置き換え）
   - マッチメイキング機能を備える

2. **SPA（シングルページアプリケーション）構成**

   - ブラウザの戻る・進むボタンが使用可能な形式で実装する
   - ページ遷移を伴わずに画面更新が行われる

3. **コンテナ化（Docker 等）**

   - 単一のコマンドでアプリケーションが立ち上がるように Docker 化
   - rootless コンテナ等、キャンパス内の環境を考慮する

4. **Firefox 最新安定版対応**

   - 主要動作対象ブラウザは Firefox（他ブラウザ対応は任意だが、今回のモジュールで互換性を拡張する）

5. **エラー／警告の制御**

   - ユーザーが通常操作を行う範囲で、未処理のエラーや警告が表示されない

6. **セキュリティ・暗号化**
   - HTTPS（wss）通信必須
   - SQL インジェクション・XSS 攻撃への対策
   - パスワードなど機密情報のハッシュ化保管
   - .env などで管理する機密情報はリポジトリに含めない

### 3.2. 技術的制約

1. **フロントエンド**:

   - デフォルトでは TypeScript ベース
   - フレームワーク／ツールを使う場合（Tailwind CSS 等）は該当モジュール要件に準拠

2. **バックエンド**:

   - デフォルトではフレームワークなしの純粋な PHP を想定
   - ただし、フレームワークモジュールを選択した場合（今回実施）は **Fastify (Node.js)** を採用し、該当モジュールの制約に従う

3. **データベース**:

   - バックエンドで DB を使用する場合、**SQLite** を利用（Database モジュール選択時の制約）

4. **外部ライブラリ・ツールの使用範囲**
   - 特定機能をすべて丸ごと実現するようなライブラリの使用は不可
   - 明示的に許可または指定されたツールは準拠
   - その他のツールを使用する場合は、評価時に正当性を説明できるようにする

---

## 4. モジュール別要件定義

以下、今回選択する **Major module** と **Minor module** について、それぞれの機能要件・技術要件・達成基準を定義します。

---

### 4.1. Web 関連

#### 4.1.1. (Major) フレームワークを使用したバックエンド構築

- **機能要件**

  1. バックエンドに **Fastify (Node.js)** を導入し、HTTP API (REST) サーバを実装する
  2. ユーザー認証、ゲーム管理、トーナメント管理等を API 経由で操作できる
  3. WebSocket 等を使用してリアルタイム通信を行い、Pong ゲーム進行やイベント通知などに対応

- **技術要件**

  1. Node.js のバージョンは安定版(LTS)を採用
  2. フレームワーク固有のベストプラクティスに従ったコード構成（ルーティング・プラグイン等）
  3. Docker コンテナとして起動可能

- **達成基準**
  1. Fastify サーバが起動し、REST API と WebSocket が正常動作する
  2. ゲームやユーザー管理の API がデータベースと連携し、一通りの CRUD 処理が可能
  3. コンテナ化後、`docker run ...` 等で一括起動できる

---

#### 4.1.2. (Minor) フロントエンド構築のためのフレームワーク／ツールキットの使用

- **機能要件**

  1. **Tailwind CSS** を導入し、統一感あるデザイン・レイアウトを実装
  2. SPA 構成を維持したまま、画面遷移やスタイルを効率的に管理

- **技術要件**

  1. TypeScript + Tailwind CSS でのフロントエンド開発
  2. Build ツール（例: Webpack, Vite など）は必要に応じて利用可（丸ごと解決するテンプレート・ライブラリの使用は不可）

- **達成基準**
  1. Tailwind CSS を用いて実装された画面が正常に表示され、基本的なコンポーネントがスタイル適用されている
  2. SPA として URL 変更、ページ切り替えなどがエラーなく動作

---

#### 4.1.3. (Minor) バックエンドでのデータベース使用

- **機能要件**

  1. ユーザー情報、トーナメント情報、ゲームスコアなどを **SQLite** データベースに保存
  2. API からの読み書き操作を行い、永続化とトランザクションを管理

- **技術要件**

  1. SQLite を採用（他の RDBMS は利用不可）
  2. Fastify との連携を行うため、ORM やクエリビルダなど小規模ライブラリの使用は可（ただし全部を丸ごと実装済みのパッケージは禁止）

- **達成基準**
  1. Docker 起動後に SQLite データベースが生成され、CRUD 操作が動作
  2. ログイン・ゲーム記録などが DB に保存され、再起動してもデータが保持される

---

#### 4.1.4. (Major) ブロックチェーン上にトーナメントのスコアを保存

- **機能要件**

  1. トーナメント終了後のスコア・優勝者情報を **Avalanche** (テストネット) 上に書き込み、改ざん防止を図る
  2. **Solidity** でスマートコントラクトを作成し、スコアの登録・取得を可能にする
  3. ブラウザまたはバックエンドからブロックチェーン呼び出しを行い、結果をフロントに表示

- **技術要件**

  1. Avalanche テストネット上でスマートコントラクトをデプロイ
  2. ブロックチェーンとの通信ライブラリ（例: ethers.js、web3.js など）を組み込み、必要メソッドを呼び出し
  3. ブロックチェーンに関連する秘密鍵や接続情報は HashiCorp Vault 等で安全に管理

- **達成基準**
  1. トーナメントごとに最終スコアをブロックチェーンへ書き込み、トランザクションを確認できる
  2. 書き込まれたスコアを閲覧し、改ざんされていないことを検証できる

---

### 4.2. User Management 関連

#### 4.2.1. (Major) 標準的なユーザーマネジメント、認証、トーナメントをまたいだユーザー管理

- **機能要件**

  1. ユーザーアカウント登録、ログイン／ログアウト、プロフィール編集機能
  2. アバター設定、フレンド管理（オンライン状況の確認）
  3. ユーザーごとの勝敗数・対戦履歴を閲覧可能
  4. トーナメントをまたいで同一ユーザーが参加できる仕組み

- **技術要件**

  1. パスワードはハッシュ化して保存
  2. API (Fastify) でユーザー登録・認証を提供
  3. セッション管理やトークン管理（後述の JWT モジュールと組み合わせる場合はそちらの要件に準拠）

- **達成基準**
  1. 任意のユーザーが新規登録後、ログインしてトーナメントに参加できる
  2. フレンドリストや対戦履歴が GUI 上できちんと参照できる
  3. ユーザー ID 連携によりトーナメントをまたいで同一ユーザーとして扱える

---

#### 4.2.2. (Major) リモート認証の実装

- **機能要件**

  1. **Google Sign-in** を利用した外部認証ログインフロー
  2. 既存ユーザー管理と併用し、Google 認証とアプリ内ユーザーアカウントを紐づけ
  3. OAuth トークンを安全に取り扱い、ログイン済み状態を維持する

- **技術要件**

  1. Google OAuth クライアントライブラリを使用
  2. リダイレクト URI / 認可コールバックを正しく設定し、セキュアにトークンを受け渡す
  3. API キーやクライアントシークレットは HashiCorp Vault 等で安全に管理

- **達成基準**
  1. 「Google でログイン」ボタンが機能し、ユーザーが OAuth 同意画面で認可後、自動的にアカウント作成される
  2. 既存ユーザーアカウントがある場合は紐づけ処理により同一アカウントとして扱われる
  3. ログイン状態で Pong やトーナメント機能を利用可能

---

### 4.3. Gameplay and User Experience 関連

#### 4.3.1. (Major) 遠隔プレイヤー（Remote players）

- **機能要件**

  1. 異なる PC・ネットワーク環境のユーザー同士が同じ対戦ルームに入り、Pong をプレイできる
  2. リアルタイムでパドル操作が共有され、ゲーム進行が同期される
  3. 回線不調や切断時のハンドリングを行い、適切なエラー表示や再接続機能を用意

- **技術要件**

  1. WebSocket (wss) や Socket.io 等による双方向通信
  2. サーバーサイドの Fastify / Node.js でリアルタイム同期を管理
  3. ラグ（遅延）対策や再接続処理を実装

- **達成基準**
  1. 2 人が異なる端末・ネットワークから接続し、リアルタイムにゲームを進行できる
  2. 片方が切断した際、ゲームが適切に終了／待機状態に入る

---

#### 4.3.2. (Major) 2 人を超えるプレイヤー（マルチプレイヤー）

- **機能要件**

  1. 3 人以上が同時に参加できるゲームモードを追加
  2. 2 人用とは異なるコートレイアウトや操作ロジックを検討（四角コートの各辺にパドル等）
  3. 遠隔プレイヤー機能と組み合わせ、マルチプレイでも同期できる

- **技術要件**

  1. ゲームルームのロジックを拡張し、N 人プレイが可能に
  2. UI / UX を適切に再設計し、プレイヤーごとの状況をわかりやすく表示

- **達成基準**
  1. 2 人以上（3 人、4 人など）で同時にゲームを遊べる
  2. リアルタイム通信で全員のパドルやボール状態が同期

---

#### 4.3.3. (Major) 追加ゲーム（ユーザーヒストリーとマッチメイキングを含む）

- **機能要件**

  1. Pong 以外のオリジナルゲームを 1 タイトル以上追加
  2. 追加ゲームでもユーザーの対戦履歴を記録・表示できる
  3. ユーザーの実力やレートを考慮したマッチメイキングシステムを導入

- **技術要件**

  1. 追加ゲーム用のフロントエンド・サーバーサイドロジックを作成
  2. DB にゲーム ID、対戦情報を保存し、複数ゲームに共通のユーザープロファイルと紐づける

- **達成基準**
  1. Pong と別ゲームをユーザーが自由に選択・対戦できる
  2. 勝敗やスコアが履歴として蓄積され、マッチメイキングに反映される

---

#### 4.3.4. (Minor) ユーザーおよびゲーム統計ダッシュボード

- **機能要件**

  1. ユーザーごとの勝率やトーナメント履歴、ゲームごとのスコア推移などを可視化
  2. ダッシュボード画面でグラフやチャートを表示

- **技術要件**

  1. シンプルなチャート用ライブラリ（Chart.js など）は一部使用可（ただし丸ごとダッシュボード生成ツールは禁止）
  2. フロントエンドで統計データを取得し、SPA 画面上で描画

- **達成基準**
  1. ログインユーザーが自分の成績をダッシュボードで確認できる
  2. トーナメント結果や連勝記録などを分かりやすいチャートで表現

---

### 4.4. Cybersecurity 関連

#### 4.4.1. (Major) WAF/ModSecurity の導入（強化設定）と HashiCorp Vault による秘密情報管理

- **機能要件**

  1. Web Application Firewall（ModSecurity）の導入により、SQL インジェクション・XSS 等を検知・ブロックする強化設定
  2. HashiCorp Vault を導入し、API キーや認証情報、ブロックチェーンの秘密鍵などを暗号化して管理
  3. Vault とアプリケーションの連携部分で必要な資格情報を動的に取得

- **技術要件**

  1. Docker コンテナ内または外部連携で ModSecurity を組み込み、フィルタリングルールを適切に設定
  2. HashiCorp Vault の導入方法、トークンやポリシー管理を検討
  3. シークレット情報をリポジトリに含めない

- **達成基準**
  1. ModSecurity が不正なリクエストを検知し、アクセスをブロックできる（簡易テストで確認）
  2. アプリケーション起動時に Vault から機密情報を取得し、ブロックチェーンや OAuth などに活用

---

#### 4.4.2. (Minor) GDPR 対応（ユーザー匿名化、ローカルデータ管理、アカウント削除）

- **機能要件**

  1. ユーザーが自分のデータ削除や匿名化をリクエストできる
  2. ローカルに保存されたクッキー情報やブラウザストレージの参照・削除が可能
  3. アカウント削除時は関連データを完全に削除／もしくは匿名化（履歴のみ残す）

- **技術要件**

  1. フロントエンド・バックエンド双方でデータ削除フローを実装
  2. ユーザー本人確認を適切に行った上でアカウント削除を実行

- **達成基準**
  1. GDPR 的に想定される「忘れられる権利」「データ閲覧権」等を最低限カバー
  2. 削除リクエスト後は対象ユーザーの PII (個人特定可能情報) が取得不能になる

---

#### 4.4.3. (Major) 2 段階認証 (2FA) と JWT の実装

- **機能要件**

  1. ユーザーログインにおいて、パスワード + ワンタイムコード（例: SMS, TOTP 等）の 2FA を要求可能
  2. JWT (JSON Web Token) を使用して認証／認可を管理し、API へのアクセスを制御
  3. 2FA をオン・オフできるユーザー設定画面を用意

- **技術要件**

  1. JWT を安全に発行／検証する仕組み（秘密鍵は Vault 管理）
  2. 2FA のワンタイムコード生成・送信（SMS ゲートウェイや認証アプリ連携等）

- **達成基準**
  1. 2FA を有効にしているユーザーはログイン時に追加コードを求められる
  2. JWT を用いた API エンドポイント保護が正しく機能し、未認証リクエストを拒否

---

### 4.5. DevOps 関連

#### 4.5.1. (Major) ログ管理のためのインフラ整備

- **機能要件**

  1. **ELK (Elasticsearch, Logstash, Kibana)** を使ったログ収集・分析基盤を構築
  2. アプリケーション・コンテナから出力されるログを一元管理し、ダッシュボードで可視化

- **技術要件**

  1. Docker Compose などを使い、ELK スタックを含むマルチコンテナ構成を管理
  2. セキュリティ対策として Kibana, Elasticsearch へのアクセス制御を設定

- **達成基準**
  1. アプリ側のログ（ユーザーアクセス、エラーログなど）が Logstash を介して Elasticsearch に格納され、Kibana で参照可能
  2. Kibana 上で簡易ダッシュボードを作成し、ログの検索・可視化ができる

---

#### 4.5.2. (Minor) 監視システム

- **機能要件**

  1. **Prometheus** と **Grafana** を使い、サーバーやアプリケーションのメトリクスを取得・可視化
  2. リソース使用量やレスポンスタイム等に閾値を設定し、アラートが可能

- **技術要件**

  1. Docker または Kubernetes 上で Prometheus, Grafana を稼働
  2. Node Exporter 等を用い、アプリケーション・ホスト OS のメトリクス取得

- **達成基準**
  1. Grafana ダッシュボードで CPU, メモリ, ネットワーク等の監視可視化
  2. 閾値超過時に通知が飛ぶ（Slack, Email 等）仕組みをテスト

---

#### 4.5.3. (Major) バックエンドのマイクロサービス化

- **機能要件**

  1. バックエンド機能（ユーザー管理、ゲーム管理、チャット等）を小さなマイクロサービスに分割
  2. サービス間通信は REST / gRPC / メッセージキュー等を検討
  3. 独立したデプロイ・スケーリングが可能

- **技術要件**

  1. Docker Compose や Kubernetes でサービスを連携させる
  2. ログ、認証、監視などの共通機能を横断的に統合

- **達成基準**
  1. ユーザー管理サービスが停止しても、ゲーム管理サービスや他サービスが動作を継続するなど疎結合が実証される
  2. サービス同士が公開 API 経由でデータ連携し、全体機能が成立

---

### 4.6. Graphics 関連

#### 4.6.1. (Major) 高度な 3D 表現技術

- **機能要件**

  1. **Babylon.js** を用いて Pong ゲームに 3D 演出を導入
  2. より臨場感あるカメラアングルやコートモデルを表示

- **技術要件**

  1. Babylon.js の基本機能を活用し、3D オブジェクトのレンダリングやアニメーションを実装
  2. パフォーマンスに配慮し、FPS が極端に落ちないよう調整

- **達成基準**
  1. 3D で描画されたコート上でパドル・ボールが動く
  2. ブラウザで負荷なくプレイ可能

---

### 4.7. Accessibility & Multi-Platform 関連

#### 4.7.1. (Minor) あらゆるデバイスでの利用サポート

- **機能要件**

  1. スマホ、タブレット、PC 等幅広い画面サイズに対応
  2. レスポンシブデザインやタッチ操作対応（UI スケーリング）

- **技術要件**

  1. Tailwind CSS 等でレスポンシブレイアウトを実装
  2. タッチ操作とキーボード操作を両立

- **達成基準**
  1. スマホでもブラウザから Pong やメニュー操作が可能
  2. 画面解像度を変えてもレイアウトが崩れない

---

#### 4.7.2. (Minor) ブラウザ互換性の拡張

- **機能要件**

  1. Firefox 以外にもう 1 つ以上のブラウザ（例: Chrome, Safari, Edge）を正式サポート
  2. ブラウザごとの不具合を検証・修正し、主要機能を確実に動作させる

- **技術要件**

  1. ユニットテストや E2E テストで複数ブラウザに対応
  2. レスポンシブデザイン・WebSocket 等の基本機能がサポートされることを確認

- **達成基準**
  1. Firefox と追加ブラウザで、全機能が正常に利用可能
  2. 追加ブラウザでのスタイル崩れや通信エラーが起きない

---

#### 4.7.3. (Minor) 多言語対応

- **機能要件**

  1. **最低 3 言語** 以上をサポート（例: 日本語, 英語, フランス語）
  2. ヘッダーや主要メニュー、ゲーム内テキストを多言語化
  3. ユーザーが言語を切り替えられる UI (言語スイッチャー) を用意

- **技術要件**

  1. i18n ライブラリや独自実装で翻訳データを管理
  2. 選択した言語をローカルストレージなどで保持

- **達成基準**
  1. 切り替え操作で表示言語が即座に変わる
  2. 再ログインしても前回選択言語を記憶

---

#### 4.7.4. (Minor) 視覚障がい者向けアクセシビリティ機能

- **機能要件**

  1. スクリーンリーダー対応（重要要素に適切な aria 属性や alt テキスト）
  2. 高コントラストモードやフォントサイズ拡大機能
  3. キーボードだけで主要操作が行える

- **技術要件**

  1. WAI-ARIA ガイドラインに準拠したマークアップ
  2. Tailwind CSS のアクセシビリティ向けユーティリティクラス利用

- **達成基準**
  1. スクリーンリーダーでメニューやボタンが読み上げられる
  2. コントラスト設定を変更しても UI が視認可能

---

#### 4.7.5. (Minor) サーバーサイドレンダリング（SSR）統合

- **機能要件**

  1. 初期ロードを高速化し、検索エンジン最適化 (SEO) を図るため SSR を導入
  2. 主要画面をサーバー側でレンダリングし、クライアントに HTML を返す

- **技術要件**

  1. Node.js + フレームワーク（Next.js などは禁止されていないか要確認）
     - ただし「モジュールを丸ごと解決する」フレームワークは不可。
     - Webpack や Vite に SSR オプションを組み込むなど工夫して実装
  2. フロント側との状態同期（Rehydration）を行い、SPA 部分を引き継ぐ

- **達成基準**
  1. アクセス時に SSR されたページが返却され、JavaScript 有効時には SPA に移行
  2. Lighthouse や SEO チェックでレンダリング済みのコンテンツが評価される

---

### 4.8. Server-Side Pong 関連

#### 4.8.1. (Major) 基本 Pong をサーバーサイドに置き換え、API を実装

- **機能要件**

  1. 従来フロント中心だった Pong ロジックをサーバー側で管理（ボール位置、衝突判定など）
  2. フロントは描画／入力送信のみ担当し、サーバーでゲーム状態を計算して定期的に結果を返す
  3. API を公開し、外部クライアントからゲームを一部制御・モニタリング可能に

- **技術要件**

  1. Fastify + WebSocket 等でサーバーサイドロジックを動かす
  2. 物理演算などシンプルなエンジンを自前実装（丸ごとライブラリは禁止）

- **達成基準**
  1. フロントを複数起動しても、サーバーが一貫したゲーム状態を管理
  2. API 経由で現在のゲームスコアやプレイヤー一覧を取得

---

#### 4.8.2. (Major) CLI で Web ユーザーと対戦（API 統合）

- **機能要件**

  1. CLI ツールとして Pong を操作し、Web 上のルームに参加可能
  2. CLI 側からもプレイヤー操作を送信し、Web ユーザーと同一ゲーム空間を共有
  3. CLI 用ログイン／認証フローを実装

- **技術要件**

  1. サーバーサイドの API を CLI から呼び出し、プレイヤー入力（上下キーなど）を送信
  2. ゲームのリアルタイムステータスを文字や簡易 UI としてコンソール出力

- **達成基準**
  1. CLI からルーム選択 → 参加 → 操作 →Web ユーザーと対戦が実現
  2. ボール位置やスコア更新がテキストまたは簡単な ASCII 表示等で表示

---

## 5. 非機能要件

1. **パフォーマンス**

   - リアルタイムゲームであるため、操作〜画面反映までの遅延が許容範囲内（100〜200ms 程度）
   - ブロックチェーンへの書き込みなどが対戦の進行を阻害しないよう非同期処理などを考慮

2. **信頼性・可用性**

   - サーバーが異常終了しても再起動後にゲーム履歴やユーザー情報が保持される
   - マイクロサービス化した場合は、一部サービス障害の影響範囲を最小化

3. **セキュリティ**

   - HTTPS / wss で暗号化
   - ModSecurity, Vault, 2FA などにより多層防御
   - GDPR 要件対応

4. **拡張性・保守性**
   - モジュール化された構成で、新規ゲーム追加や機能拡張が容易
   - ログ監視、アラートなど DevOps 基盤で運用性を高める

---

## 6. リスクと想定課題

1. **リアルタイム通信の遅延**
   - ネットワーク不安定によるゲーム体験の低下
   - → リトライ・再接続機構、描画補間などの実装
2. **ブロックチェーン連携の複雑化**
   - スマートコントラクトの不具合やガス代など
   - → テストネット利用、Vault 管理の徹底
3. **セキュリティ強化による構成の複雑化**
   - ModSecurity, Vault, 2FA, JWT … 多数の要素で連携ミスが起きる可能性
   - → ドキュメント整備・統合テスト
4. **マイクロサービスの管理負荷**
   - サービス間通信や分散トランザクション管理の難易度
   - → 明確な責務分離・API 契約定義

---

## 7. 受け入れ基準

1. **必須機能の正常動作**
   - Pong ゲームの 2 人対戦が問題なく実行できる（SPA / Firefox 対応）
   - 選択したモジュールの要件をすべて満たしている
   - Docker でワンコマンド起動し、主要機能が確認できる
2. **セキュリティ対策**
   - HTTPS / wss / パスワードハッシュ / SQL インジェクション対策 / XSS 対策 / .env 管理
3. **モジュールごとの要件達成**
   - 上記で定義したそれぞれの「達成基準」を満たす
4. **動作確認のデモ / ドキュメント**
   - README やチーム内ドキュメントに起動手順と簡易的な操作手順を明記
   - 評価者が容易に環境構築・テストできる状態

---

## 8. 今後のスケジュール（例）

1. **設計フェーズ**
   - バックエンド構成（Fastify + SQLite + Vault）のベース実装
   - フロントエンド（TypeScript + Tailwind）基盤整備
2. **モジュール別開発フェーズ**
   - ユーザーマネジメント → リモート認証 → 2FA/JWT → 遠隔プレイ → マルチプレイ … の順など
   - 並行してブロックチェーンや 3D グラフィックスなど別チームで対応
3. **統合テスト・負荷テスト**
   - リアルタイム通信確認、WAF / Vault / GDPR / ログ監視等の最終チェック
4. **リリース・評価準備**
   - Docker Compose / ELK / ModSecurity 設定を最適化
   - 最終デモ環境構築

---

## 9. まとめ

本要求要件定義書では、**Pong ゲームを核としつつ、多様なモジュールを組み合わせた高度なウェブアプリケーション**を構築するための要件を整理しました。

- バックエンドは **Fastify (Node.js)** + **SQLite** + **WAF/ModSecurity** + **Vault** というセキュアな構成
- フロントエンドは **TypeScript** + **Tailwind CSS** でモダンな UI/UX を提供
- **Remote players** や **マルチプレイ**、**ブロックチェーン**でのスコア保存、**2FA/JWT** 認証など幅広い拡張機能
- **GDPR 対応**や **アクセシビリティ**、**多言語化**、**SSR**、**ELK によるログ管理**など非機能面も強化

最終的には Docker コンテナで統合し、簡便にデプロイおよび評価できる形とします。以上の要件を満たし、評価時にはモジュールごとの機能がすべてクリアできるよう開発を進めていきます。
