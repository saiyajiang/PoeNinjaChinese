#!/usr/bin/env node
/**
 * 联盟名补翻测试（v2.3.0）
 *
 * 复现用户截图：poe.ninja 官方繁中版「挑战联盟」下，
 * 除了第一格「禁忌仪式」，其余 7 格联盟名仍是英文。
 * 官方只本地化了基础联盟名，HC / SSF 前缀组合与新联盟没翻。
 *
 * 用法：node tools/league-test.mjs
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = readFileSync(join(ROOT, 'PoeNinjaChinese.user.js'), 'utf8');
const noop = () => {};
const store = new Map();

const TW_BODY = '挑戰聯盟 過往聯盟 禁忌儀式 個角色 返回搜尋 統計 能力值 能量護盾 '.repeat(20);
const body = { innerText: TW_BODY, textContent: TW_BODY, appendChild: noop };
const docEl = {
  getAttribute: (k) => (k === 'lang' ? 'zh-TW' : null),
  setAttribute: noop, get lang() { return 'zh-TW'; },
  addEventListener: noop, removeEventListener: noop
};
const sandbox = {
  console: { log: noop, warn: noop, error: noop },
  setTimeout, clearTimeout, setInterval: () => 0, clearInterval: noop,
  requestAnimationFrame: (f) => setTimeout(f, 0),
  NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 },
  MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
  Blob: class {}, URL: { createObjectURL: () => 'blob:', revokeObjectURL: noop },
  location: { pathname: '/zh-tw/poe2/builds', href: 'https://poe.ninja/zh-tw/poe2/builds', reload: noop },
  document: {
    readyState: 'complete', body, documentElement: docEl, head: { appendChild: noop },
    createElement: () => ({ style: {}, dataset: {}, setAttribute: noop, getAttribute: () => null,
      appendChild: noop, addEventListener: noop, closest: () => null }),
    createTreeWalker: () => ({ nextNode: () => null, currentNode: null }),
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

const results = [];
function check(name, got, expect) {
  const ok = got === expect;
  results.push(ok);
  console.log(`${ok ? '✅' : '❌'} ${name} → ${JSON.stringify(got)}${ok ? '' : `（期望 ${JSON.stringify(expect)}）`}`);
}

// 截图里的 8 个卡片标题（繁中页面，脚本把繁转简 + 补翻残留英文）
const cards = [
  ['禁忌仪式', '禁忌仪式'],                       // 官方已翻，只需繁→简
  ['Runes of Aldur', '奥杜尔秘符'],               // 腾讯官方译名，非编年史「奥杜尔符文」
  ['HC Forbidden Rites', '专家·禁忌仪式'],
  ['HC Runes of Aldur', '专家·奥杜尔秘符'],
  ['SSF Forbidden Rites', '独狼·禁忌仪式'],
  ['SSF Runes of Aldur', '独狼·奥杜尔秘符'],
  ['HC SSF Forbidden Rites', '专家独狼·禁忌仪式'],
  ['HC SSF Runes of Aldur', '专家独狼·奥杜尔秘符']
];
console.log('── 截图 8 个联盟卡片 ──');
for (const [src, exp] of cards) check(src, api.translatePhrase(src), exp);

console.log('\n── 带「联盟」后缀（角色页标题就是这种）──');
check('HC SSF Forbidden Rites 聯盟',
  api.translatePhrase('HC SSF Forbidden Rites 聯盟'), '专家独狼·禁忌仪式 联盟');
check('SSF Runes of Aldur 聯盟',
  api.translatePhrase('SSF Runes of Aldur 聯盟'), '独狼·奥杜尔秘符 联盟');
check('Forbidden Rites 聯盟',
  api.translatePhrase('Forbidden Rites 聯盟'), '禁忌仪式 联盟');

console.log('\n── 边界 ──');
check('大小写不敏感', api.translatePhrase('hc ssf forbidden rites'), '专家独狼·禁忌仪式');
check('不应把编年史译名混进来',
  api.translatePhrase('Runes of Aldur').includes('符文'), false);
check('不替换开关关闭时完全不动', (() => {
  api.setReplace(false);
  const got = api.translatePhrase('HC Forbidden Rites');
  api.setReplace(true);
  return got;
})(), 'HC Forbidden Rites');
check('切到英文页面时不替换', (() => {
  api.setPageLang(false);
  const got = api.translatePhrase('Runes of Aldur');
  api.setPageLang(true);
  return got;
})(), 'Runes of Aldur');
check('普通英文句不受影响',
  api.translatePhrase('Twisters fired at the same time can merge'),
  'Twisters fired at the same time can merge');

const pass = results.filter(Boolean).length;
console.log(`\n${pass}/${results.length} 通过`);
process.exit(pass === results.length ? 0 : 1);
