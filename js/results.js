/**
 * 結果表示テンプレ（防御反応を出さない文章）
 */

/**
 * タイプ名（主軸に基づく自己認識ラベル）
 */
export const typeNames = {
  decision: '優先順位 未翻訳タイプ',
  execution: '現場情報 未接続タイプ',
  companion: '右腕 未配置タイプ',
};

export const typeTaglines = {
  decision: '判断基準がAIに渡っていないため、無難な答えしか返ってきません',
  execution: '現場の制約が伝わっていないため、理想論で止まりやすい状態です',
  companion: 'AIの役割が曖昧なため、出力の方向が定まりにくい状態です',
};

/**
 * タイプ別インサイト（小さな驚き）
 */
export const typeInsights = {
  decision: 'あなたの詰まりは、AIの性能ではなく「何を優先するか」の翻訳不足です',
  execution: 'あなたの詰まりは、AIの性能ではなく「現場の事情」の翻訳不足です',
  companion: 'あなたの詰まりは、AIの性能ではなく「AIへの役割指定」の翻訳不足です',
};

/**
 * スコア別の一行アドバイス（高スコア = ズレが大きい）
 */
export const scoreAdvice = {
  decision: {
    high: 'まず優先順位を言語化すると、結論が出やすくなります',
    mid: '優先順位はある程度伝わっていますが、もう少し明確にできます',
    low: '優先順位の伝え方は比較的うまくいっています',
  },
  execution: {
    high: '現場の制約を3つだけ渡すと、実行可能な答えに変わります',
    mid: '制約は一部伝わっていますが、精度を上げる余地があります',
    low: '現場情報の伝え方は比較的うまくいっています',
  },
  companion: {
    high: 'AIの役割を1つに絞ると、返答のトーンが変わります',
    mid: '役割はぼんやり伝わっていますが、もう一段明確にできます',
    low: '役割設定は比較的うまくいっています',
  },
};

/**
 * コピペ用入力テンプレート（タイプ別）
 */
export const copyTemplates = {
  decision: {
    priority: '優先順位：〇〇 / 〇〇 / 〇〇（例：スピード重視 / コスト最小 / 現場負担なし）',
    constraint: '制約：該当するものを記入（人・時間・予算・NG事項）',
    role: 'AIの役割：結論を先に出して、次にやることを3つに絞る',
  },
  execution: {
    priority: '優先順位：〇〇 / 〇〇 / 〇〇（例：現実的 / 今のメンバーで / 来週までに）',
    constraint: '制約：人数〇名 / 期限〇〇 / 予算〇〇 / やれないこと〇〇',
    role: 'AIの役割：現場の事情を踏まえて、実行可能な案だけ出す',
  },
  companion: {
    priority: '優先順位：〇〇 / 〇〇 / 〇〇（例：信頼重視 / チームが動ける / 納得感）',
    constraint: '制約：該当するものを記入（人・時間・予算・NG事項）',
    role: 'AIの役割：参謀 / 段取り番頭 / 現場通訳（1つ選ぶ）',
  },
};

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
