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
  demoContent,
  shareText,
  ctaTexts,
} from './results.js';
import { trackEvent, saveResult, getLastResult } from './events.js';

// --- State ---
const state = {
  currentQuestion: 0,
  answers: {},
  scores: null,
};

// --- CTA URL（後で差し替え可能） ---
const CTA_URL = '#'; // TODO: 予約ページ or LINE のURLに差し替え

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

// --- Quiz Page ---
function renderQuiz() {
  const q = questions[state.currentQuestion];
  const progress = ((state.currentQuestion + 1) / questions.length) * 100;
  const isLast = state.currentQuestion === questions.length - 1;

  document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
  document.getElementById('quiz-progress-text').textContent =
    `${state.currentQuestion + 1}/${questions.length}`;

  trackEvent('view_quiz', { question: state.currentQuestion + 1 });

  const selectedChoice = state.answers[q.id] || null;

  const content = document.getElementById('quiz-content');
  content.innerHTML = `
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
      ${
        state.currentQuestion > 0
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
  trackEvent('view_result', { topAxes: s.topAxes });

  // スコアチャート
  const maxScore = 14;
  const chartEl = document.getElementById('score-chart');
  chartEl.innerHTML = ['decision', 'execution', 'companion']
    .map((axis) => {
      const isTop = s.topAxes.includes(axis);
      const pct = Math.round((s[axis] / maxScore) * 100);
      return `
      <div class="score-axis">
        <div class="score-axis-header">
          <span class="score-axis-name ${isTop ? 'is-top' : ''}">
            ${axisShortLabels[axis]}
            ${isTop ? '<span class="top-badge">ズレが大きい</span>' : ''}
          </span>
          <span class="score-axis-value">${s[axis]}pt</span>
        </div>
        <div class="score-axis-bar">
          <div class="score-axis-fill ${axis}" style="width: ${pct}%"></div>
        </div>
        <div class="text-sm text-muted mt-8">${axisDescriptions[axis]}</div>
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

  const demo = demoContent;

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
