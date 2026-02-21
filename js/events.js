/**
 * イベントログ（匿名・計測用）
 */

function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

let sessionId = null;

function getSessionId() {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('syacho_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('syacho_session_id', sessionId);
    }
  }
  return sessionId;
}

const eventLog = [];

/**
 * イベントを記録する
 * @param {string} eventName - イベント名
 * @param {Object} [data] - 追加データ
 */
export function trackEvent(eventName, data = {}) {
  const event = {
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
    event: eventName,
    ...data,
  };

  eventLog.push(event);

  // コンソールに出力（開発用・将来的にAPIへ送信）
  console.log('[Event]', eventName, data);

  // localStorageに保存（集計用）
  try {
    const stored = JSON.parse(localStorage.getItem('syacho_events') || '[]');
    stored.push(event);
    localStorage.setItem('syacho_events', JSON.stringify(stored));
  } catch {
    // storage full or unavailable - silently ignore
  }
}

/**
 * 診断結果を保存する
 * @param {Object} resultData - { answers, scores, topAxes }
 */
export function saveResult(resultData) {
  const data = {
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
    ...resultData,
  };

  try {
    localStorage.setItem('syacho_last_result', JSON.stringify(data));
  } catch {
    // silently ignore
  }
}

/**
 * 保存済み結果を取得
 */
export function getLastResult() {
  try {
    const data = localStorage.getItem('syacho_last_result');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * 全イベントログを取得（開発・集計用）
 */
export function getEventLog() {
  try {
    return JSON.parse(localStorage.getItem('syacho_events') || '[]');
  } catch {
    return eventLog;
  }
}
