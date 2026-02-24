/**
 * 社長AI ギャップ診断アプリ - メインアプリケーション
 */
import { questions } from './questions.js';
import { calculateScores } from './scoring.js';
import {
  axisLabels,
  axisShortLabels,
  axisDescriptions,
  resultTemplates,
  demoContents,
  demoContent,
  shareText,
  ctaTexts,
  typeNames,
  typeTaglines,
  typeInsights,
  scoreAdvice,
  copyTemplates,
  miniOsTemplates,
} from './results.js';
import { trackEvent, saveResult, getLastResult } from './events.js';

// --- State ---
const state = {
  currentQuestion: 0,
  answers: {},
  scores: null,
};

// --- CTA URL（後で差し替え可能） ---
const CTA_URL = 'lp.html#lp-apply';

// --- DOM Cache ---
const pages = {
  home: document.getElementById('page-home'),
  quiz: document.getElementById('page-quiz'),
  result: document.getElementById('page-result'),
  demo: document.getElementById('page-demo'),
};

// --- Router ---
function showPage(pageId) {
  Object.values(pages).forEach((p) => p.classList.remove('active'));
  pages[pageId].classList.add('active');
  window.scrollTo(0, 0);
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  switch (hash) {
    case '#/quiz':
      showPage('quiz');
      break;
    case '#/result':
      showPage('result');
      break;
    case '#/demo':
      showPage('demo');
      break;
    default:
      showPage('home');
      break;
  }
}

// --- Home Page ---
function initHome() {
  document.getElementById('btn-start').addEventListener('click', () => {
    trackEvent('click_start');
    state.currentQuestion = 0;
    state.answers = {};
    window.location.hash = '#/quiz';
    renderQuiz();
  });
}

// --- ミニ報酬メッセージ（Q3回答後に表示） ---
function getMiniRewardHtml() {
  // Q3まで回答済みの場合のみ表示
  if (state.currentQuestion !== 3) return '';
  const answered = Object.keys(state.answers).length;
  if (answered < 3) return '';

  // 暫定傾向を計算
  const tempScores = { decision: 0, execution: 0, companion: 0 };
  for (const [qId, choice] of Object.entries(state.answers)) {
    const qScores = getTempScore(Number(qId), choice);
    if (qScores) {
      tempScores.decision += qScores.decision;
      tempScores.execution += qScores.execution;
      tempScores.companion += qScores.companion;
    }
  }
  const leading = Object.entries(tempScores).sort((a, b) => b[1] - a[1])[0][0];
  const hints = {
    decision: '決め方が曖昧になりやすいかも',
    execution: '現場の事情がAIに届いていないかも',
    companion: 'AIの役割が定まっていないかも',
  };

  return `<div class="quiz-mini-reward">ここまでの傾向：${hints[leading]}（残り4問で確定します）</div>`;
}

// 簡易スコア参照（scoring.jsのscoreMapを再現せずimportから取得）
function getTempScore(qId, choice) {
  const scoreMap = {
    1: { A: { decision: 2, execution: 0, companion: 0 }, B: { decision: 0, execution: 2, companion: 0 }, C: { decision: 0, execution: 0, companion: 2 } },
    2: { A: { decision: 2, execution: 0, companion: 0 }, B: { decision: 1, execution: 1, companion: 0 }, C: { decision: 0, execution: 0, companion: 2 } },
    3: { A: { decision: 0, execution: 2, companion: 0 }, B: { decision: 2, execution: 0, companion: 0 }, C: { decision: 0, execution: 0, companion: 2 } },
    4: { A: { decision: 2, execution: 0, companion: 0 }, B: { decision: 0, execution: 2, companion: 0 }, C: { decision: 1, execution: 0, companion: 1 } },
    5: { A: { decision: 0, execution: 2, companion: 0 }, B: { decision: 1, execution: 1, companion: 0 }, C: { decision: 0, execution: 0, companion: 2 } },
    6: { A: { decision: 2, execution: 0, companion: 0 }, B: { decision: 0, execution: 2, companion: 0 }, C: { decision: 0, execution: 0, companion: 2 } },
    7: { A: { decision: 1, execution: 1, companion: 1 }, B: { decision: 1, execution: 1, companion: 1 }, C: { decision: 0, execution: 0, companion: 0 } },
  };
  return scoreMap[qId]?.[choice] || null;
}

// --- Quiz Page ---
function renderQuiz() {
  const q = questions[state.currentQuestion];
  const progress = ((state.currentQuestion + 1) / questions.length) * 100;
  const isLast = state.currentQuestion === questions.length - 1;

  // 残り時間表示（1問約25秒想定）
  const remaining = questions.length - state.currentQuestion;
  const remainingSeconds = remaining * 25;
  const remainingText = remainingSeconds >= 60
    ? `残り約${Math.ceil(remainingSeconds / 60)}分`
    : `残り約${remainingSeconds}秒`;

  document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
  document.getElementById('quiz-progress-text').textContent = remainingText;

  trackEvent('view_quiz', { question: state.currentQuestion + 1 });

  const selectedChoice = state.answers[q.id] || null;
  const miniReward = getMiniRewardHtml();

  const content = document.getElementById('quiz-content');
  content.innerHTML = `
    ${miniReward}
    <div class="quiz-question-number">Q${q.id}</div>
    <h2 class="quiz-question-text">${escapeHtml(q.text)}</h2>
    <div class="quiz-choices">
      ${q.choices
      .map(
        (c) => `
        <button class="quiz-choice ${selectedChoice === c.label ? 'selected' : ''}"
                data-choice="${c.label}"
                type="button"
                aria-label="${c.label}. ${c.text}">
          <span class="quiz-choice-label">${c.label}</span>
          <span class="quiz-choice-text">${escapeHtml(c.text)}</span>
        </button>
      `
      )
      .join('')}
    </div>
    <div class="quiz-nav">
      ${state.currentQuestion > 0
      ? '<button id="btn-prev" class="btn btn-ghost" type="button">← 戻る</button>'
      : ''
    }
    </div>
  `;

  // Choice handlers
  content.querySelectorAll('.quiz-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      state.answers[q.id] = choice;
      trackEvent(`answer_q${q.id}`, { choice });

      // Visual feedback
      content.querySelectorAll('.quiz-choice').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Auto-advance after short delay
      setTimeout(() => {
        if (isLast) {
          completeQuiz();
        } else {
          state.currentQuestion++;
          renderQuiz();
        }
      }, 300);
    });
  });

  // Back button
  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      state.currentQuestion--;
      renderQuiz();
    });
  }
}

function completeQuiz() {
  trackEvent('complete_quiz', { answers: { ...state.answers } });

  state.scores = calculateScores(state.answers);

  saveResult({
    answers: state.answers,
    scores: {
      decision: state.scores.decision,
      execution: state.scores.execution,
      companion: state.scores.companion,
    },
    topAxes: state.scores.topAxes,
  });

  renderResult();
  window.location.hash = '#/result';
}

// --- スコアレベル判定 ---
function getScoreLevel(score) {
  if (score >= 8) return 'high';
  if (score >= 4) return 'mid';
  return 'low';
}

// --- Result Page ---
function renderResult() {
  const scores = state.scores;
  if (!scores) {
    // 結果がない場合は保存データから復元
    const saved = getLastResult();
    if (saved) {
      state.scores = { ...saved.scores, topAxes: saved.topAxes };
      state.answers = saved.answers;
    } else {
      window.location.hash = '#/';
      return;
    }
  }

  const s = state.scores;
  const primaryAxis = s.topAxes[0];
  trackEvent('view_result', { topAxes: s.topAxes, type: typeNames[primaryAxis] });

  // タイプ名ヒーロー
  document.getElementById('result-type-name').textContent = typeNames[primaryAxis];
  document.getElementById('result-type-tagline').textContent = typeTaglines[primaryAxis];

  // インサイト（小さな驚き）
  document.getElementById('result-insight').textContent = typeInsights[primaryAxis];

  // スコアチャート（アドバイス付き）
  const maxScore = 14;
  const chartEl = document.getElementById('score-chart');
  chartEl.innerHTML = ['decision', 'execution', 'companion']
    .map((axis) => {
      const isTop = s.topAxes.includes(axis);
      const pct = Math.round((s[axis] / maxScore) * 100);
      const level = getScoreLevel(s[axis]);
      const advice = scoreAdvice[axis][level];
      return `
      <div class="score-axis">
        <div class="score-axis-header">
          <span class="score-axis-name ${isTop ? 'is-top' : ''}">
            ${axisShortLabels[axis]}
            ${isTop ? '<span class="top-badge">ズレが大きい</span>' : ''}
          </span>
          <span class="score-axis-value">${s[axis]}<span class="score-axis-max">/${maxScore}</span></span>
        </div>
        <div class="score-axis-bar">
          <div class="score-axis-fill ${axis}" style="width: ${pct}%"></div>
        </div>
        <div class="score-axis-advice">${advice}</div>
      </div>
    `;
    })
    .join('');

  // 結果詳細（上位2軸）
  const detailsEl = document.getElementById('result-details');
  detailsEl.innerHTML = s.topAxes
    .map((axis) => {
      const t = resultTemplates[axis];
      return `
      <div class="card result-detail">
        <div class="result-detail-title">${axisLabels[axis]}</div>
        <div class="result-item">
          <span class="result-item-label observation">いま起きていること</span>
          ${escapeHtml(t.observation)}
        </div>
        <div class="result-item">
          <span class="result-item-label cause">その原因</span>
          ${escapeHtml(t.cause)}
        </div>
        <div class="result-item">
          <span class="result-item-label inevitability">なぜそうなるか</span>
          ${escapeHtml(t.inevitability)}
        </div>
        <div class="result-item">
          <span class="result-item-label prescription">やること</span>
          ${escapeHtml(t.prescription)}
        </div>
      </div>
    `;
    })
    .join('');

  // ミニOS自動生成（穴埋めではなく埋まった状態で出す）
  const miniOs = miniOsTemplates[primaryAxis];
  const miniOsText = miniOs.lines.join('\n');
  const templateEl = document.getElementById('copy-template-box');
  templateEl.innerHTML = `
    <div class="mini-os-title">${escapeHtml(miniOs.title)}</div>
    ${miniOs.lines.map((line) => `<div class="copy-template-line">${escapeHtml(line)}</div>`).join('')}
    <div class="mini-os-prompt">${escapeHtml(miniOs.prompt)}</div>
  `;

  // テンプレコピーボタン
  document.getElementById('btn-copy-template').addEventListener('click', () => {
    navigator.clipboard.writeText(miniOsText).then(() => {
      trackEvent('copy_template');
      const btn = document.getElementById('btn-copy-template');
      const icon = document.getElementById('template-copy-icon');
      const feedback = document.getElementById('template-copy-feedback');
      btn.classList.add('copied');
      icon.textContent = '✅';
      feedback.textContent = 'コピーしました！AIへの相談時に貼り付けてください';
      setTimeout(() => {
        btn.classList.remove('copied');
        icon.textContent = '📋';
        feedback.textContent = '';
      }, 3000);
    });
  });

  // CTA
  document.getElementById('cta-text').innerHTML =
    `${escapeHtml(ctaTexts.main)}<br><strong>${escapeHtml(ctaTexts.sub)}</strong>`;
  document.getElementById('cta-button').href = CTA_URL;

  // Share text
  const currentUrl = window.location.origin + window.location.pathname;
  document.getElementById('share-text-box').textContent = shareText + '\n' + currentUrl;

  // Demo button
  document.getElementById('btn-view-demo').addEventListener('click', () => {
    trackEvent('click_view_demo');
    renderDemo();
    window.location.hash = '#/demo';
  });

  // Copy button
  document.getElementById('btn-copy-share').addEventListener('click', () => {
    const text = shareText + '\n' + currentUrl;
    navigator.clipboard.writeText(text).then(() => {
      trackEvent('copy_share_text');
      const label = document.getElementById('copy-label');
      const icon = document.getElementById('copy-icon');
      const btn = document.getElementById('btn-copy-share');
      btn.classList.add('copied');
      icon.textContent = '✅';
      label.textContent = 'コピーしました！';
      setTimeout(() => {
        btn.classList.remove('copied');
        icon.textContent = '📋';
        label.textContent = 'テキストをコピー';
      }, 2000);
    });
  });
}

// --- Demo Page ---
function renderDemo() {
  trackEvent('view_demo');

  // タイプに応じたデモを選択
  const primaryAxis = state.scores?.topAxes?.[0] || 'companion';
  const demo = demoContents[primaryAxis] || demoContents.companion;

  // Before input
  document.getElementById('demo-before-input').textContent = demo.before.input;

  // Before output
  const beforeList = document.getElementById('demo-before-output');
  beforeList.innerHTML = demo.before.output.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  document.getElementById('demo-before-comment').textContent = `※ ${demo.before.comment}`;

  // After input
  document.getElementById('demo-after-input').innerHTML = demo.after.inputLines
    .map((line) => `<div>${escapeHtml(line)}</div>`)
    .join('');

  // After output
  const afterOutput = document.getElementById('demo-after-output');
  afterOutput.innerHTML = `
    <div class="demo-conclusion">結論：${escapeHtml(demo.after.output.conclusion)}</div>
    <div class="demo-section-label">今週やること3つ：</div>
    <ul>
      ${demo.after.output.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join('')}
    </ul>
    <div class="demo-section-label">やらないこと：</div>
    <ul>
      ${demo.after.output.dontDo.map((d) => `<li class="demo-dont">${escapeHtml(d)}</li>`).join('')}
    </ul>
  `;

  // CTA
  document.getElementById('cta-button-demo').href = CTA_URL;
  document.getElementById('cta-button-demo').addEventListener('click', () => {
    trackEvent('click_cta_from_demo');
  });

  // Back to result
  document.getElementById('btn-back-result').addEventListener('click', () => {
    window.location.hash = '#/result';
  });
}

// --- Utility ---
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Initialize ---
function init() {
  trackEvent('view_home');
  initHome();

  window.addEventListener('hashchange', () => {
    handleRoute();

    // ページ表示時にイベントをトラック
    const hash = window.location.hash || '#/';
    if (hash === '#/') trackEvent('view_home');
    if (hash === '#/result') renderResult();
    if (hash === '#/demo') renderDemo();
  });

  // 初期ルーティング
  handleRoute();
}

document.addEventListener('DOMContentLoaded', init);
