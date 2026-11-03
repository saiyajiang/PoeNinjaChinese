#!/usr/bin/env node
/**
 * 首屏重扫集成测试（v2.2.1）
 *
 * 复现用户报告：刷新后红框区域仍是繁体，但点「🔄 更新词库」立刻变简体。
 * 根因：首屏语言判定未就绪时 scanText 把节点永久加进 seen，
 *       rescanAll()（更新词库调用）清空 seen 才重新转换。
 *
 * 这里用带真实文本节点的 DOM stub 跑完整的 scan → scanText → translatePhrase 链路：
 *   ① 首屏英文版扫过一遍，节点不进 seen、保持繁体
 *   ② 站顶切到官方繁中（URL 变 /zh-tw/），自动整页重扫，节点全部转简
 *   ③ 不需要手动点「更新词库」
 *
 * 用法：node tools/scan-test.mjs
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = readFileSync(join(ROOT, 'PoeNinjaChinese.user.js'), 'utf8');
const noop = () => {};
const store = new Map();

// 截图红框里的真实文案
const SOURCE = [
  '經濟', '流派', '天賦樹', '返回搜尋', '上一個', '下一個',
  '時光機', '最新快照', '等級 100 古靈軍團', '個人資料', '帳號',
  '統計', '角色', '能力值', '移動速度', '物品稀有度', '能量護盾',
  '防禦', '閃避值', '閃避機率', '偏斜值', '偏斜率', '物理視為',
  '最大承受擊中', '生命回復', '魔力回復', '能量護盾充能', '主要技能'
];
// 注意两条命中了「编年史用词层」，比纯字形转换更优先，属于预期行为：
//   古靈軍團(Gemling Legionnaire) → 古灵使徒斗士
//   閃避機率 → 闪避几率（大陆用语，而非字形层的「闪避机率」）
const EXPECT = [
  '经济', '流派', '天赋树', '返回搜寻', '上一个', '下一个',
  '时光机', '最新快照', '等级 100 古灵使徒斗士', '个人资料', '账号',
  '统计', '角色', '能力值', '移动速度', '物品稀有度', '能量护盾',
  '防御', '闪避值', '闪避几率', '偏斜值', '偏斜率', '物理视为',
  '最大承受击中', '生命回复', '魔力回复', '能量护盾充能', '主要技能'
];

function fakeParent() {
  return {
    tagName: 'SPAN', nodeType: 1, childElementCount: 0,
    isContentEditable: false, nextSibling: null, parentElement: null,
    attrs: {},
    getAttribute(k) { return this.attrs[k] || null; },
    setAttribute(k, v) { this.attrs[k] = v; },
    closest() { return null; },
    appendChild: noop, addEventListener: noop
  };
}

const nodes = SOURCE.map((t) => ({
  nodeType: 3, nodeValue: t, nextSibling: null,
  parentElement: fakeParent()
}));

const EN_TEXT = 'Builds Path of Exile 2 Economy Passive Skill Tree Characters Statistics '
              + 'Life Mana Energy Shield Evasion Rating Armour DPS Effective Health Pool '.repeat(12);
const TW_TEXT = SOURCE.join(' ') + ' '.repeat(1) + SOURCE.join(' ').repeat(8);

const body = {
  nodeType: 1, tagName: 'BODY', isContentEditable: false,
  innerText: EN_TEXT, textContent: EN_TEXT,
  appendChild: noop, closest: () => null,
  getAttribute: () => null, setAttribute: noop, addEventListener: noop
};
const docEl = {
  _lang: 'en',
  getAttribute(k) { return k === 'lang' ? this._lang : null; },
  setAttribute(k, v) { if (k === 'lang') this._lang = v; },
  get lang() { return this._lang; },
  addEventListener: noop, removeEventListener: noop
};

const sandbox = {
  console: { log: noop, warn: noop, error: noop },
  setTimeout, clearTimeout, setInterval: () => 0, clearInterval: noop,
  requestAnimationFrame: (f) => setTimeout(f, 0),
  NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 },
  MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
  Blob: class {}, URL: { createObjectURL: () => 'blob:', revokeObjectURL: noop },
  location: { pathname: '/poe2/builds', href: 'https://poe.ninja/poe2/builds', reload: noop },
  document: {
    readyState: 'complete', body, documentElement: docEl, head: { appendChild: noop },
    createElement: () => ({ style: {}, dataset: {}, setAttribute: noop, getAttribute: () => null,
      appendChild: noop, addEventListener: noop, closest: () => null }),
    // 只遍历我们预置的文本节点，并套用脚本传入的 acceptNode 过滤
    createTreeWalker: (root, _what, filter) => {
      const list = nodes.filter((n) => {
        const r = filter && filter.acceptNode ? filter.acceptNode(n) : 1;
        return r !== 2;   // FILTER_REJECT
      });
      let i = -1;
      return { nextNode() { i++; return i < list.length; }, get currentNode() { return list[i]; } };
    },
    getElementById: () => null, addEventListener: noop
  },
  GM_getValue: (k) => (store.has(k) ? store.get(k) : undefined),
  GM_setValue: (k, v) => store.set(k, v),
  GM_registerMenuCommand: noop, GM_addStyle: noop, GM_notification: noop,
  GM_xmlhttpRequest: (o) => setTimeout(() => (o.onerror || noop)(new Error('offline')), 0)
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
await new Promise((r) => setTimeout(r, 60));

const api = sandbox.__PoeNinjaChinese;
if (!api) { console.error('❌ 脚本未暴露调试入口'); process.exit(1); }

// 关闭跨节点合并，让每个文本节点独立走一遍（红框文案本来就是独立节点）
api.state.mergeAcross = false;

function setPage(lang, path, text) {
  docEl._lang = lang;
  sandbox.location.pathname = path;
  sandbox.location.href = 'https://poe.ninja' + path;
  body.innerText = text;
  body.textContent = text;
  api.refreshPageLang(true);
}

// ── ① 首屏：英文版（无 zh-tw 前缀）──
setPage('en', '/poe2/builds', EN_TEXT);
api.setNeedFull(true);
api.flush();
const afterFirst = nodes.map((n) => n.nodeValue);
const firstAllTraditional = afterFirst.every((v, i) => v === SOURCE[i]);
console.log(`${firstAllTraditional ? '✅' : '❌'} 首屏英文版：${SOURCE.length} 个节点保持官方繁体原文`);

// ── ② 站顶切到「繁體中文」：URL 变成 /zh-tw/，正文换成中文 ──
setPage('zh-TW', '/zh-tw/poe2/builds/forbiddenrites/character/xxx', TW_TEXT);
// 模拟「站顶切语言」触发的轮询，不调用 rescanAll / 更新词库
api.pollPageLang();
api.flush();

const afterSwitch = nodes.map((n) => n.nodeValue);
const bad = [];
afterSwitch.forEach((v, i) => { if (v !== EXPECT[i]) bad.push([SOURCE[i], v, EXPECT[i]]); });
const allConverted = bad.length === 0;
console.log(`${allConverted ? '✅' : '❌'} 切到 /zh-tw/ 后自动整页重扫：${SOURCE.length - bad.length}/${SOURCE.length} 节点转简（未点「更新词库」）`);
if (bad.length) {
  console.log('   未通过示例：');
  for (const [src, got, exp] of bad.slice(0, 8)) {
    console.log(`     ${JSON.stringify(src)} → ${JSON.stringify(got)}（期望 ${JSON.stringify(exp)}）`);
  }
}

// 抽几个截图里最显眼的词展示
console.log('\n   抽样：');
for (const i of [0, 2, 8, 11, 16]) {
  console.log(`     ${SOURCE[i]} → ${afterSwitch[i]}`);
}

// ── ③ 再切回 English：从此刻起停止替换 ──
setPage('en', '/poe2/builds', EN_TEXT);
api.pollPageLang();
api.flush();
const backToEN = api.isOfficialTraditional() === false;
console.log(`${backToEN ? '✅' : '❌'} 切回 English：判定翻转，脚本停手`);

const ok = firstAllTraditional && allConverted && backToEN;
console.log(`\n${ok ? '全部通过 ✅' : '存在失败 ❌'}`);
process.exit(ok ? 0 : 1);
