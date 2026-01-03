<div align="center">

# 🛡️ DriftGuard

**自律型モデルドリフト検出 & MLOps リカバリーシステム**

[ 🇬🇧 English ](README.md) | [ 🇯🇵 日本語 ](README_ja.md)

<br />

[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

  <p>
    <b>DriftGuard</b> は、本番環境における機械学習モデルの劣化を監視、検出し、修復するために設計されたエンタープライズグレードの MLOps ダッシュボードです。不透明なモデルの障害を<b>定量化可能なヘルス指標</b>と<b>自動化された再学習戦略</b>に置き換えます。
  </p>

[Report Bug](https://github.com/shafayatsaad/driftguard/issues) · [Request Feature](https://github.com/shafayatsaad/driftguard/issues)

</div>

---

## 💡 プロジェクト概要

本番環境では、MLモデルはエラースタックトレースを出して停止するわけではありません。データの分布が変化（データドリフト）したり、関係性が変化（コンセプトドリフト）したりすることで、静かに精度が低下していきます。

**DriftGuard** は、以下の機能を持つ継続的な監視レイヤーを提供することでこれを解決します。
1.  **ドリフトの定量化**: Population Stability Index (PSI) などの統計手法を使用して、分布の変化を測定します。
2.  **影響の可視化**: ドリフトスコアと推定精度の低下を相関させます。
3.  **アクションの提示**: モデルを再学習するか、そのまま運用するか、コスト対効果の分析を自動化します。

### MLOps の核心原則

-   **可観測性ファースト (Observability First)**: モデルの健全性をダッシュボード中心に表示（ヘルススコア）。
-   **統計的厳密性**: 単純な件数カウントではなく、確立された指標（PSI、KLダイバージェンス）に信頼を置く。
-   **実用的なインサイト**: 推奨事項をビジネス価値（リスクのある収益 vs 再学習コスト）にリンクさせる。

---

## 🚀 主な機能

### 📊 リアルタイム・ドリフト監視
-   **リアルタイム・ヘルススコア**: すべての特徴量のドリフト深刻度から導出された複合指標（0-100）。
-   **動的メトリクス**: 「総予測数」、「平均ドリフトスコア」、「推定精度」をライブで追跡。
-   **特徴量レベルの診断**: モデルの劣化を引き起こしている具体的な特徴量（例：`収入`、`年齢`、`負債比率`など）を特定。

### 🧠 インテリジェント再学習推奨
-   **費用対効果エンジン**: 現在の収益損失と計算コストに基づいて、モデルの再学習が収益上有利かどうかを自動的に計算します。
-   **自動スケジューリング**: 閾値を超えた場合、ワンクリックで再学習ジョブをスケジュール可能。

### ⚡ 予測とトレンド
-   **履歴分析**: ドリフトの傾向を30/60/90日間で表示し、徐々に進行する劣化を特定。
-   **インタラクティブ・レポート**: コンプライアンスや監査のために包括的なドリフトレポート（`.csv`、`.pdf`）をエクスポート可能。

### 🔔 スマートアラート
-   **設定可能なルール**: 条件付きアラートを設定可能（例：「収入のPSIが6時間連続で0.2を超えた場合」）。
-   **マルチチャネル通知**: Slack、Email、PagerDuty（シミュレーション）への通知ロジックを統合。

---

## 💻 コードスポットライト

DriftGuard は **Population Stability Index (PSI)** を使用して分布の変化を検出します。以下はバックエンドの検出ロジックの一部です。

```python
# backend/drift_detection.py

def calculate_psi(expected, actual, buckets=10):
    """
    データドリフトを測定するために Population Stability Index (PSI) を計算します。
    PSI < 0.1: 有意なドリフトなし
    PSI < 0.2: 中程度のドリフト
    PSI >= 0.2: 重大なドリフト
    """
    def scale_range(input, min, max):
        input += (1e-6)  # ゼロ除算を回避
        interp = np.interp(input, (min, max), (0, 1))
        return interp

    breakpoints = np.arange(0, buckets + 1) / (buckets) * 100
    # ... 割合を計算するロジック ...
    
    psi_value = np.sum((actual_prop - expected_prop) * np.log(actual_prop / expected_prop))
    return psi_value
```

---

## 🏗️ デモシナリオ

このプロジェクトには、さまざまな本番状態をデモンストレーションするための堅牢なシミュレーションエンジン `demo_scenarios.py` が含まれています。

| シナリオ | 説明 | 効果 |
| :--- | :--- | :--- |
| **1. ベースライン (健全)** | 学習データと一致する正規分布。 | ヘルススコア: ~98/100 |
| **2. 突然のドリフト (攻撃)** | 重要な特徴量における急激な変化をシミュレート。 | ヘルススコア: ~45/100 |
| **3. 緩やかな減衰** | 時間の経過とともに徐々にノイズを導入。 | ヘルススコア: ~80/100 |

シナリオを実行するには：
```bash
python demo_scenarios.py --scenario 2
```

---

## 📁 プロジェクト構造

```bash
DriftGuard/
├── backend/            # Flask API & ML ロジック
│   ├── app.py          # メインアプリケーションのエントリーポイント
│   ├── drift_detection.py # PSI/ドリフトのコア計算
│   ├── data_generator.py # 合成データ生成
│   └── service.py      # ビジネスロジック層
├── frontend/           # React ダッシュボード
│   ├── src/
│   │   ├── components/ # Dashboard, Trends, Alerts コンポーネント
│   │   ├── App.tsx     # メインルーティング & レイアウト
│   │   └── types.ts    # TypeScript 定義
│   └── tailwind.config.js
├── data/               # デモ用のローカルCSVストレージ
└── demo_scenarios.py   # ドリフトシミュレーション用CLIツール
```

---

## 🏁 はじめに

### 前提条件
-   Python 3.9以上
-   Node.js 16以上

### 1. バックエンドのセットアップ

```bash
cd backend
# 仮想環境を作成 (任意)
python -m venv venv
source venv/bin/activate  # Windowsの場合は venv\Scripts\activate

# 依存関係をインストール (pandas, numpy, flask が必要です)
pip install flask flask-cors pandas numpy

# APIを実行
python app.py
```
*サーバーは `http://localhost:5000` で稼働します*

### 2. フロントエンドのセットアップ

```bash
cd frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```
*ダッシュボードは `http://localhost:5173` で稼働します*

---

## 🤝 コントリビュート

ドリフト検出アルゴリズムの改善や新しい可視化ウィジェットの追加など、貢献を歓迎します。

1.  プロジェクトをフォークする
2.  機能ブランチを作成する (`git checkout -b feature/NewMetric`)
3.  変更をコミットする (`git commit -m 'Add KL Divergence metric'`)
4.  ブランチにプッシュする (`git push origin feature/NewMetric`)
5.  プルリクエストを作成する

---

## 📄 ライセンス

MITライセンスの下で配布されています。詳細は `LICENSE` を参照してください。

---

## 👤 メンテナー

[Shafayat Saad](https://github.com/shafayatsaad) - MLOps エンジニア

