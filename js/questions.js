/**
 * 診断コンテンツ（7問）
 * 回答はすべて3択（A/B/C）
 */
export const questions = [
  {
    id: 1,
    text: '相談するとき、何が一番困る？',
    choices: [
      { label: 'A', text: '結論が出ない' },
      { label: 'B', text: '行動に落ちない' },
      { label: 'C', text: 'しっくり来ない' },
    ],
  },
  {
    id: 2,
    text: '自分の意思決定はどれに近い？',
    choices: [
      { label: 'A', text: '数字・根拠' },
      { label: 'B', text: '直感・スピード' },
      { label: 'C', text: '人・空気・信頼' },
    ],
  },
  {
    id: 3,
    text: 'AIの返答で一番イラッとするのは？',
    choices: [
      { label: 'A', text: '一般論' },
      { label: 'B', text: '抽象論' },
      { label: 'C', text: '責任回避っぽい言い方' },
    ],
  },
  {
    id: 4,
    text: '会議で起きがちなのは？',
    choices: [
      { label: 'A', text: '議論は多いが決まらない' },
      { label: 'B', text: '決まるが動かない' },
      { label: 'C', text: '方向性が曖昧' },
    ],
  },
  {
    id: 5,
    text: '外注・社員への指示で多いのは？',
    choices: [
      { label: 'A', text: '伝えたつもりが伝わってない' },
      { label: 'B', text: '指示が細かくなりすぎる' },
      { label: 'C', text: '任せたいのに不安' },
    ],
  },
  {
    id: 6,
    text: 'いま一番欲しいAIの役割は？',
    choices: [
      { label: 'A', text: '決めてくれる参謀' },
      { label: 'B', text: '段取りしてくれる番頭' },
      { label: 'C', text: '現場に伝えてくれる通訳' },
    ],
  },
  {
    id: 7,
    text: 'AIに渡している前提情報は？',
    choices: [
      { label: 'A', text: 'ほぼ渡してない' },
      { label: 'B', text: '断片だけ' },
      { label: 'C', text: 'ある程度渡してる' },
    ],
  },
];
