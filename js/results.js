/**
 * 結果表示テンプレ（防御反応を出さない文章）
 */

export const axisLabels = {
  decision: '決め方のズレ',
  execution: '伝わり方のズレ',
  companion: '役割設定のズレ',
};

export const axisShortLabels = {
  decision: '決め方',
  execution: '伝わり方',
  companion: '役割設定',
};

export const axisDescriptions = {
  decision: '何を優先して決めるか、AIに伝えていない',
  execution: '現場の事情をAIに渡していない',
  companion: 'AIにどんな役割をやらせるか決めていない',
};

export const resultTemplates = {
  decision: {
    observation: 'AIが無難で、決めきれない答えになりがちです',
    cause: '「何を優先して決めるか」をAIに伝えていません',
    inevitability: '伝えないと、AIは安全運転の一般論しか出せません',
    prescription: '優先順位を3つだけ先に渡すと、結論が出やすくなります',
  },
  execution: {
    observation: '答えは出るのに、現場で動く形になりにくいです',
    cause: '現場の事情（人・時間・予算・NG事項）をAIに渡していません',
    inevitability: '事情を知らないと、AIは理想論しか出せません',
    prescription: '制約を3つだけ渡すと、明日やることに変わります',
  },
  companion: {
    observation:
      'しっくり来ない、当たり障りがない、と感じやすいです',
    cause: 'AIにどんな役割をやらせるか決めていません',
    inevitability: '役割がないと、AIは無難な返しになりがちです',
    prescription:
      '参謀・段取り番頭・現場通訳のどれか1つに絞ると、返答が変わります',
  },
};

/**
 * Before/Afterデモコンテンツ（会議テーマ）
 */
export const demoContent = {
  theme: '会議',
  before: {
    input: '会議が長い。改善したい。',
    output: [
      '目的を明確にしましょう',
      'アジェンダを作りましょう',
      '進行役が重要です',
    ],
    comment: '綺麗だけど、結局どうすればいいかわからない',
  },
  after: {
    inputLines: [
      '優先順位：スピード重視 / 現場の手間を増やさない / 数字で確認',
      '役割：段取り番頭。結論から言って、次にやることを3つに絞る',
      '相談：会議が長い。改善したい。',
    ],
    output: {
      conclusion: '会議は30分固定、決める会議だけ残す',
      actions: [
        '議題テンプレを作る',
        '誰が決めるかを先に決める',
        '「これが決まったら終わり」を最初に宣言する',
      ],
      dontDo: ['全員参加', '議論のための議論'],
    },
  },
};

/**
 * 紹介転送用テキスト
 */
export const shareText = `AIに相談してもイマイチな答えしか返ってこない原因がわかる診断、やってみたら面白かったです。7問・3分で終わります。
売り込みじゃなくて、自分の使い方のどこがズレてるか見えるやつです。`;

/**
 * CTA文言
 */
export const ctaTexts = {
  main: 'あなたの会社に合わせて、優先順位3つとAIの役割1つを決めるだけで返答が変わります',
  sub: 'それを一緒に作るのが社長AIセッションです',
  button: '社長AIセッションを見てみる',
};
