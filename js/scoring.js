/**
 * スコアリング仕様（3軸）
 *
 * Decision OS（判断基準ギャップ）
 * Execution OS（現場翻訳ギャップ）
 * Companion OS（補助人格ギャップ）
 */

// 配点ルール: question index → choice label → { decision, execution, companion }
const scoreMap = {
  1: {
    A: { decision: 2, execution: 0, companion: 0 },
    B: { decision: 0, execution: 2, companion: 0 },
    C: { decision: 0, execution: 0, companion: 2 },
  },
  2: {
    A: { decision: 2, execution: 0, companion: 0 },
    B: { decision: 1, execution: 1, companion: 0 },
    C: { decision: 0, execution: 0, companion: 2 },
  },
  3: {
    A: { decision: 0, execution: 2, companion: 0 },
    B: { decision: 2, execution: 0, companion: 0 },
    C: { decision: 0, execution: 0, companion: 2 },
  },
  4: {
    A: { decision: 2, execution: 0, companion: 0 },
    B: { decision: 0, execution: 2, companion: 0 },
    C: { decision: 1, execution: 0, companion: 1 },
  },
  5: {
    A: { decision: 0, execution: 2, companion: 0 },
    B: { decision: 1, execution: 1, companion: 0 },
    C: { decision: 0, execution: 0, companion: 2 },
  },
  6: {
    A: { decision: 2, execution: 0, companion: 0 },
    B: { decision: 0, execution: 2, companion: 0 },
    C: { decision: 0, execution: 0, companion: 2 },
  },
  7: {
    A: { decision: 1, execution: 1, companion: 1 },
    B: { decision: 1, execution: 1, companion: 1 },
    C: { decision: 0, execution: 0, companion: 0 },
  },
};

/**
 * 回答配列からスコアを算出
 * @param {Object} answers - { 1: 'A', 2: 'B', ... }
 * @returns {{ decision: number, execution: number, companion: number, topAxes: string[] }}
 */
export function calculateScores(answers) {
  const scores = { decision: 0, execution: 0, companion: 0 };

  for (const [qId, choice] of Object.entries(answers)) {
    const qScores = scoreMap[qId]?.[choice];
    if (qScores) {
      scores.decision += qScores.decision;
      scores.execution += qScores.execution;
      scores.companion += qScores.companion;
    }
  }

  // 上位2軸を特定（同点の場合: Decision > Execution > Companion）
  const axes = [
    { key: 'decision', label: 'Decision OS', score: scores.decision },
    { key: 'execution', label: 'Execution OS', score: scores.execution },
    { key: 'companion', label: 'Companion OS', score: scores.companion },
  ];

  // スコア降順でソート（同点は定義順 = 優先順位順）
  axes.sort((a, b) => b.score - a.score);

  const topAxes = axes.slice(0, 2).map((a) => a.key);

  return { ...scores, topAxes };
}

/**
 * スコアの最大値（理論上の上限）
 */
export const MAX_SCORE = 14;
