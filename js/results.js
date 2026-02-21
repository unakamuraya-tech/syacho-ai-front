/**
 * 結果表示テンプレ（防御反応を出さない文章）
 */

export const axisLabels = {
  decision: '判断基準ギャップ（Decision OS）',
  execution: '現場翻訳ギャップ（Execution OS）',
  companion: '補助人格ギャップ（Companion OS）',
};

export const axisShortLabels = {
  decision: 'Decision OS',
  execution: 'Execution OS',
  companion: 'Companion OS',
};

export const axisDescriptions = {
  decision: '何を優先して決めるかが未設定',
  execution: '現場で動く言葉へ翻訳する情報が未設定',
  companion: '社長の苦手領域を補う役割分担が未設定',
};

export const resultTemplates = {
  decision: {
    observation: 'AIが無難で、決めきれない答えになりがちです',
    cause: '判断基準（何を優先して決めるか）が未設定です',
    inevitability: 'AIは安全運転の一般論に寄ります',
    prescription: '判断基準を3つだけ先に渡すと、結論が出やすくなります',
  },
  execution: {
    observation: '答えは出るのに、現場で動く形に落ちにくいです',
    cause: '現場の制約（人/時間/予算/禁止）情報が未設定です',
    inevitability: 'AIは理想論の提案になりやすいです',
    prescription: '制約を3つだけ渡すと、明日やることに変わります',
  },
  companion: {
    observation:
      'しっくり来ない、寄り添いすぎる、責任がぼやけると感じやすいです',
    cause: '社長の苦手を補う役割（補助人格）が未設定です',
    inevitability: 'AIは当たり障りのない口調になりやすいです',
    prescription:
      '参謀/COO/翻訳者のどれか1体を固定すると、挙動が安定します',
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
      'ファシリテーションが重要です',
    ],
    comment: '綺麗だが決まらない／動かない',
  },
  after: {
    inputLines: [
      '判断基準：スピード優先 / 現場負荷を増やさない / 数字で検証',
      '補助人格：COO。結論先出し、次の一手を3つに絞る',
      '相談：会議が長い。改善したい。',
    ],
    output: {
      conclusion: '会議は30分固定、決める会議だけ残す',
      actions: [
        '議題テンプレを作る',
        '決裁ラインを明確にする',
        '会議終了条件を設定する',
      ],
      dontDo: ['全員参加', '議論のための議論'],
    },
  },
};

/**
 * 紹介転送用テキスト
 */
export const shareText = `AIがうまく動かない原因がわかる診断を見つけました。7問・3分で終わるので試してみてください。
売り込みとかじゃなく、自分のAI活用のズレが見えるやつです。`;

/**
 * CTA文言
 */
export const ctaTexts = {
  main: 'あなたの会社用に、判断基準3つと補助人格1体を作るとAIの挙動が安定します',
  sub: 'その設計を一緒にやるのが社長AIセッションです',
  button: '社長AIセッションを見る',
};
