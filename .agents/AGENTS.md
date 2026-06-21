# projectC Development Rules

This is the active development environment for **projectC**.

## Project Context
- **Root Directory**: `C:/Users/Chimpanzee/Desktop/projectC`
- **Subdirectories**:
  - `analytics/`: Data analysis and causal impact/LTV analysis.
  - `games/`: Game development directory.
  - `３D_printer/`: 3D printer related CAD models and projects (e.g., create_crab/CAD, ガザミ).
- **Target Role**: Coding assistant and developer for this project.

## Agent Behavior
- Always default to using files under `C:/Users/Chimpanzee/Desktop/projectC` as the target for read/write/compile actions.
- Automatically assume this is the development workspace when starting a session inside this project.
- Respond in Japanese.

## Git Branching Model
- **Main Branches**:
  - `main`: 本番/安定ブランチ。
  - `develop`: 開発統合ブランチ。
  - `feature/...` (例: `feature/top-page`): 各機能やゲームの開発用ブランチ。
- **Workflow**:
  - 開発作業（コードの追加や修正）は常に現在のアクティブなフィーチャーブランチ（例: `feature/top-page`）上で行います。
  - 明示的な指示がない限り、`main` や `develop` ブランチへ直接コミット・マージを行わないようにします。
