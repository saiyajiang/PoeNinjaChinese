#!/usr/bin/env node
/**
 * 页面语言检测 / 替换开关测试（v2.2）
 *
 * 覆盖用户反馈的三个问题：
 *   1. 站顶切到 English 后脚本必须完全停手，一个字都不替换
 *   2. 繁中页面整页转简 —— 不只用词，每个繁体「字」都要变简体
 *   3. 脚本只有「替换 / 不替换」两态，不再有简/繁/英三态
 *
 * 用法：node tools/lang-test.mjs
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = readFileSync(join(ROOT, 'PoeNinjaChinese.user.js'), 'utf8');

const noop = () => {};
const store = new Map();

// 页面正文可动态替换，模拟站顶 Language 切换后 SPA 重绘内容
const body = { innerText: '', textContent: '', appendChild: noop };
const docEl = {
  _lang: '',
  getAttribute(k) { return k === 'lang' ? this._lang : null; },
  setAttribute(k, v) { if (k === 'lang') this._lang = v; },
  get lang() { return this._lang; },
  addEventListener: noop,
  removeEventListener: noop
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

// 采样串：繁中页面汉字足够多；英文页面几乎全是拉丁字母
const TW = '鋼鐵守護 風魔舞者 骷髏巨獸 每秒攻擊次數 物品等級 能量護盾 暴擊機率 '
         + '風暴編織者 賦予技能 詞綴 昇華職業 神聖石 崇高石 卡蘭德的魔鏡 '.repeat(12);
const EN = 'Builds Path of Exile 2 Available Leagues Gemling Legionnaire Stormweaver '
         + 'Titan Blood Mage Deadeye Infernalist Oracle Disciple of Varashta '.repeat(14);

function setPage(htmlLang, text) {
  docEl._lang = htmlLang;
  body.innerText = text;
  body.textContent = text;
  return api.refreshPageLang(true);      // 强制刷新，绕过 TTL 缓存
}

const results = [];
function check(name, got, expect) {
  const ok = got === expect;
  results.push([name, ok, got, expect]);
  console.log(`${ok ? '✅' : '❌'} ${name} → ${JSON.stringify(got)}${ok ? '' : `（期望 ${JSON.stringify(expect)}）`}`);
}

// ── 1. 初始英文版：必须完全停手 ──
setPage('en', EN);
check('英文版：判定为非中文页', api.isOfficialTraditional(), false);
check('英文版：繁体串不替换', api.translatePhrase('鋼鐵守護'), '鋼鐵守護');
check('英文版：英文词条也不替换', api.translatePhrase('Tabula Rasa'), 'Tabula Rasa');
check('英文版：长英文句不替换', api.translatePhrase('Twisters fired at the same time can merge'), 'Twisters fired at the same time can merge');

// ── 2. 切到官方繁體中文：整页转简 ──
setPage('zh-TW', TW);
check('繁中页：判定为中文页', api.isOfficialTraditional(), true);
check('繁中页：用词层（编年史）', api.translatePhrase('鋼鐵守護'), '钢铁看守');
check('繁中页：字形层逐字转简', api.translatePhrase('風暴編織者'), '风暴编织者');
check('繁中页：纯繁体句子也全量转简',
  api.translatePhrase('這是一個繁體字測試'), '这是一个繁体字测试');
check('繁中页：腾讯层优先', (api.addTencent('鋼鐵守護', '腾讯官方译名'),
  api.translatePhrase('鋼鐵守護')), '腾讯官方译名');

// ── 3. 再切回 English：立刻停手（v2.1 锁死导致继续替换的 bug）──
setPage('en', EN);
check('切回英文：判定翻转', api.isOfficialTraditional(), false);
check('切回英文：繁体串不再替换', api.translatePhrase('鋼鐵守護'), '鋼鐵守護');
check('切回英文：英文串不再替换', api.translatePhrase('Tabula Rasa'), 'Tabula Rasa');

// ── 4. <html lang> 不变、只有正文变（SPA 切语言不更新 lang）──
docEl._lang = 'en';
setPage('en', TW);
check('lang=en 但正文中文：仍判为中文页', api.isOfficialTraditional(), true);
check('lang=en 但正文中文：正常转简', api.translatePhrase('詞綴'), '词缀');

// ── 5. 「替换 / 不替换」两态 ──
api.setReplace(false);
check('关闭替换：繁中页也完全不动', api.translatePhrase('風魔舞者'), '風魔舞者');
check('关闭替换：状态为 off', api.state.lang, 'off');
api.setReplace(true);
check('开启替换：恢复转简', api.translatePhrase('風魔舞者'), '风舞者');
check('开启替换：状态为 on', api.state.lang, 'on');
check('两态之外没有 tw 状态', ['on', 'off'].includes(api.state.lang), true);

// ── 6. 页面未渲染完：不替换 ──
setPage('en', '');
check('空白页：判定为非中文', api.isOfficialTraditional(), false);
check('空白页：不替换', api.translatePhrase('鋼鐵守護'), '鋼鐵守護');

const pass = results.filter((r) => r[1]).length;
console.log(`\n${pass}/${results.length} 通过`);
process.exit(pass === results.length ? 0 : 1);
