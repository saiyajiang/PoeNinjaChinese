#!/usr/bin/env node
/**
 * 用真实的「未翻译字符串」导出文件跑一遍翻译核心，输出覆盖率。
 *
 *   node tools/coverage.mjs <missing.json> [--show 60]
 *
 * 覆盖率 = 输入串中能被翻译（输出与输入不同）的比例。
 * 用来判断词库补齐是否真的解决了页面上"大片英文"的问题。
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const file = process.argv[2];
if (!file) { console.error('用法：node tools/coverage.mjs <missing.json>'); process.exit(1); }
const showArg = process.argv.indexOf('--show');
const SHOW = showArg >= 0 ? Number(process.argv[showArg + 1] || 60) : 60;

const code = readFileSync(join(ROOT, 'PoeNinjaChinese.user.js'), 'utf8');
const store = new Map();
const noop = () => {};
const fakeEl = () => ({ style: {}, dataset: {}, textContent: '', setAttribute: noop, getAttribute: () => null, appendChild: noop, remove: noop, addEventListener: noop, closest: () => null, click: noop });

const sandbox = {
  console: { log: noop, warn: noop, error: noop },
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: (f) => setTimeout(f, 0),
  NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 },
  MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
  Blob: class {}, URL: { createObjectURL: () => 'blob:', revokeObjectURL: noop },
  location: { pathname: '/poe2/builds', href: 'https://poe.ninja/poe2/builds', reload: noop },
  document: { readyState: 'complete', body: null, head: { appendChild: noop }, createElement: fakeEl, createTreeWalker: () => ({ nextNode: () => null, currentNode: null }), getElementById: () => null, addEventListener: noop },
  GM_getValue: (k) => (store.has(k) ? store.get(k) : undefined),
  GM_setValue: (k, v) => store.set(k, v),
  GM_registerMenuCommand: noop, GM_addStyle: noop, GM_notification: noop,
  GM_xmlhttpRequest: (o) => setTimeout(() => (o.onerror || noop)(new Error('offline')), 0)
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
await new Promise((r) => setTimeout(r, 60));
const api = sandbox.__PoeNinjaChinese;
// v2.1 起只有官方繁體中文页面才做覆盖；离线跑覆盖率时模拟已判定为繁中
api.setPageLang(true);

const data = JSON.parse(readFileSync(file, 'utf8'));
const items = data.items;

const CJK = /[　-〿㐀-鿿＀-￯]/;
// 不该翻译的东西：品牌名、角色名（连续驼峰无空格）、稀有物品随机名
const SKIP = /^(poe\.ninja|discord|github|poedb\.tw|poe2db\.tw)$/i;
const isBrandOrName = (s) => SKIP.test(s) || (/^[A-Z][a-zA-Z]{6,}$/.test(s) && !/\s/.test(s));
const hit = [], miss = [], stale = [], skip = [];
for (const s of items) {
  const out = api.translatePhrase(s);
  if (out !== s) { hit.push([s, out]); continue; }
  // 导出时已被翻成一半的串（含中文）不算真实缺口：页面初始是纯英文，不会再出现
  if (CJK.test(s)) { stale.push([s, out]); continue; }
  (isBrandOrName(s) ? skip : miss).push([s, out]);
}

const pure = miss.length + hit.length;   // 剔除残留与本就不该翻的后的有效样本
const pct = (n, d) => (d ? n / d * 100 : 0).toFixed(1) + '%';
console.log(`词条总数：${items.length}（残留 ${stale.length} + 品牌/角色名 ${skip.length} 条不计入）`);
console.log(`✅ 已翻译：${hit.length}  (${pct(hit.length, pure)})`);
console.log(`❌ 仍为英文：${miss.length}  (${pct(miss.length, pure)})　← 真实缺口`);

if (SHOW) {
  console.log('\n--- 翻译样例 ---');
  for (const [a, b] of hit.slice(0, Math.min(SHOW, hit.length))) console.log(`  ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
  console.log('\n--- 仍为英文（按长度排序）---');
  for (const [a] of miss.sort((x, y) => y[0].length - x[0].length).slice(0, Math.min(SHOW, miss.length))) console.log(`  ${a}`);
  if (skip.length) {
    console.log(`\n--- 品牌名 / 角色名 / 内部 ID ${skip.length} 条（本就不翻译，仅列前 ${Math.min(SHOW, skip.length)} 条）---`);
    for (const [a] of skip.slice(0, Math.min(SHOW, skip.length))) console.log(`  ${a}`);
  }
  if (stale.length) {
    console.log(`\n--- 残留串 ${stale.length} 条（导出时已半翻译，页面刷新后不会重现，仅列前 ${Math.min(SHOW, stale.length)} 条）---`);
    for (const [a] of stale.slice(0, Math.min(SHOW, stale.length))) console.log(`  ${a}`);
  }
}

process.exit(0);
