/**
 * 冒烟测试：在 Node 里用最小 DOM stub 跑一遍脚本，验证翻译核心逻辑。
 * 用法：node tools/smoke-test.mjs
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const code = readFileSync(new URL('../PoeNinjaChinese.user.js', import.meta.url), 'utf8');

const store = new Map();
const noop = () => {};
const fakeEl = () => ({
  style: {}, dataset: {}, textContent: '',
  setAttribute: noop, getAttribute: () => null, appendChild: noop, remove: noop,
  addEventListener: noop, closest: () => null, click: noop
});

const sandbox = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: (f) => setTimeout(f, 0),
  NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 },
  MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
  Blob: class {},
  URL: { createObjectURL: () => 'blob:', revokeObjectURL: noop },
  location: { pathname: '/poe1/economy', href: 'https://poe.ninja/poe1/economy', reload: noop },
  document: {
    readyState: 'complete',
    body: null,
    head: { appendChild: noop },
    createElement: fakeEl,
    createTreeWalker: () => ({ nextNode: () => null, currentNode: null }),
    getElementById: () => null,
    addEventListener: noop
  },
  GM_getValue: (k) => (store.has(k) ? store.get(k) : undefined),
  GM_setValue: (k, v) => store.set(k, v),
  GM_registerMenuCommand: noop,
  GM_addStyle: noop,
  GM_notification: noop,
  GM_xmlhttpRequest: (o) => setTimeout(() => (o.onerror || noop)(new Error('offline in test')), 0)
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

await new Promise((r) => setTimeout(r, 60));

const api = sandbox.__PoeNinjaChinese;
if (!api) { console.error('❌ 脚本未暴露调试入口'); process.exit(1); }

// v2.1 起只有「官方繁體中文」页面才做覆盖；测试里模拟已判定为繁中
api.setPageLang(true);

// 注入一批假词条，模拟 poedb 词库
Object.assign(api.state.dict.cn, {
  'Tabula Rasa': '白袍',
  'Kaom\'s Heart': '卡欧的心脏',
  'Mirror of Kalandra': '卡兰德的魔镜',
  'Headhunter': '猎首',
  'Vaal Orb': '瓦尔宝珠',
  'Awakened Elemental Focus Support': '觉醒·元素集中辅助',
  'The Doctor': '医生',
  'Grace': '优雅'
});
Object.assign(api.state.ui.cn, { 'Chaos Value': '混沌石价值', 'Search filters...': '筛选…' });

const cases = [
  ['Tabula Rasa', '白袍'],
  ['Mirror of Kalandra', '卡兰德的魔镜'],
  ['Awakened Elemental Focus Support', '觉醒·元素集中辅助'],
  ['Chaos Value', '混沌石价值'],
  ['Search filters...', '筛选…'],
  ['3x Kaom\'s Heart (Corrupted)', '3x 卡欧的心脏 (已腐化)'],  // 括号内的界面词也一并翻译
  ['Price: 12.5', '价格: 12.5'],          // 界面词命中、数字原样保留
  ['12.5', '12.5'],                       // 纯数字不该被翻译
  ['The Doctor', '医生']
];

let pass = 0;
for (const [input, expect] of cases) {
  const got = api.translatePhrase(input);
  const ok = got === expect;
  console.log(`${ok ? '✅' : '❌'} ${JSON.stringify(input)} → ${JSON.stringify(got)}${ok ? '' : `（期望 ${JSON.stringify(expect)}）`}`);
  if (ok) pass++;
}

// 接口数据翻译
const payload = {
  lines: [
    { id: 1, name: 'Headhunter', baseType: 'Leather Belt', detailsId: 'headhunter', icon: 'https://x/y.png', explicitModifiers: [{ text: 'Adds 1 to 2 Physical Damage', optional: false }] }
  ],
  language: { name: 'en' }
};
api.translatePayload(payload, '');
const okPayload =
  payload.lines[0].name === '猎首' &&
  payload.lines[0].baseType === 'Leather Belt' &&
  payload.lines[0].detailsId === 'headhunter' &&
  payload.lines[0].icon === 'https://x/y.png' &&
  payload.lines[0].explicitModifiers[0].text === 'Adds 1 to 2 Physical Damage';
console.log(`${okPayload ? '✅' : '❌'} 接口数据翻译（name 翻译、detailsId/icon 不动）→`, JSON.stringify(payload.lines[0]));
if (okPayload) pass++;

// ── v2.1：繁转简分层 + 官方语言门槛 ──
const extra = [];

// ① 编年史层（腾讯层没有这个词）
extra.push(['编年史层用词转换', api.toSimplified('鋼鐵守護').text === '钢铁看守',
  api.toSimplified('鋼鐵守護').text]);
// ② 字形层兜底
extra.push(['字形层转换', api.toSimplified('風暴編織者').text === '风暴编织者',
  api.toSimplified('風暴編織者').text]);
// ③ 腾讯国服层优先级高于编年史层
api.addTencent('鋼鐵守護', '腾讯译名优先');
extra.push(['腾讯层优先于编年史层', api.toSimplified('鋼鐵守護').text === '腾讯译名优先',
  api.toSimplified('鋼鐵守護').text]);
// ④ 英文版 / 非繁中页面：一律不覆盖（用户随时能看英文原版）
api.setPageLang(false);
extra.push(['非繁中页面不覆盖繁体', api.translatePhrase('鋼鐵守護') === '鋼鐵守護',
  api.translatePhrase('鋼鐵守護')]);
extra.push(['非繁中页面不覆盖英文', api.translatePhrase('Tabula Rasa') === 'Tabula Rasa',
  api.translatePhrase('Tabula Rasa')]);
api.setPageLang(true);
// ⑤ 恢复繁中后转换恢复
extra.push(['恢复繁中后继续覆盖', api.translatePhrase('風魔舞者') === '风舞者',
  api.translatePhrase('風魔舞者')]);

for (const [name, ok, got] of extra) {
  console.log(`${ok ? '✅' : '❌'} ${name} → ${JSON.stringify(got)}`);
  if (ok) pass++;
}

const total = cases.length + 1 + extra.length;
console.log(`\n${pass}/${total} 通过`);
process.exit(pass === total ? 0 : 1);
