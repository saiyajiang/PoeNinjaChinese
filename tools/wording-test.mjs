#!/usr/bin/env node
/**
 * 简繁「用语差异」测试（v2.5.0）
 *
 * 用户反馈：目前翻译只是把繁体字换成简体字，但简中与繁中的**用词**不同。
 * 根因：原三层里腾讯层 10 条、编年史层 560 条全是游戏内物品/技能专名，
 *       poe.ninja 站点自己的繁中 UI 用词（資訊 / 搜尋 / 匯入 / 機率 / 能力值…）
 *       根本不在词库里，全部落到字形层 →「資訊→资讯」「搜尋→搜寻」这种台湾腔。
 *
 * 本测试用 poe.ninja /zh-tw/ 页面真实文本验证四层优先级，并量化
 * 「用词层命中字符 / 总汉字数」的提升。
 *
 * 用法：node tools/wording-test.mjs
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = readFileSync(join(ROOT, 'PoeNinjaChinese.user.js'), 'utf8');
const noop = () => {};
const store = new Map();

const TW_BODY = '挑戰聯盟 過往聯盟 經濟 流派 天賦樹 統計 能力值 移動速度 能量護盾 '
              + '個人資料 帳號 時光機 最新快照 資訊 設定 搜尋 匯入代碼 '.repeat(20);
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
const T = (s) => api.translatePhrase(s);

console.log('── ① 腾讯国服层（最高优先，PoE 界面用词）──');
for (const [src, exp] of [
  ['能力值', '属性值'],
  ['能量球', '充能球'],
  ['輿圖天賦樹', '异界天赋树'],
  ['私人聯盟', '私享服'],
  ['神聖石', '神圣石']
]) check(src, T(src), exp);

console.log('\n── ② 通用简繁用语层（字形转换做不出来的差异）──');
for (const [src, exp] of [
  ['資訊', '信息'],
  ['搜尋', '搜索'],
  ['返回搜尋', '返回搜索'],
  ['進階搜尋', '高级搜索'],
  ['匯入', '导入'],
  ['匯入代碼', '导入代码'],
  ['Path of Building 匯入代碼', 'Path of Building 导入代码'],
  ['預設', '默认'],
  ['設定', '设置'],
  ['儲存', '保存'],
  ['載入', '加载'],
  ['載入中', '加载中'],
  ['重新整理', '刷新'],
  ['登入', '登录'],
  ['伺服器', '服务器'],
  ['資料庫', '数据库'],
  ['檔案', '文件'],
  ['網路', '网络'],
  ['軟體', '软件'],
  ['支援', '支持'],
  ['程式', '程序'],
  ['機率', '几率'],
  ['閃避機率', '闪避几率'],
  ['暴擊機率', '暴击几率'],
  ['進階選項', '高级选项'],
  ['收合', '收起'],
  ['貼上', '粘贴'],
  ['復原', '撤销'],
  ['清單', '列表'],
  ['狀態列', '状态栏'],
  ['視窗', '窗口'],
  ['稍後再試', '稍后重试'],
  ['目前價格', '当前价格']
]) check(src, T(src), exp);

console.log('\n── ③ 编年史层仍生效（游戏专名，不被新层覆盖）──');
for (const [src, exp] of [
  ['鋼鐵守護', '钢铁看守'],
  ['碎骨', '七伤破'],
  ['風魔舞者', '风舞者'],
  ['拾荒者護板', '装甲回收'],
  ['萊基亞塔的流動', '拉其塔之流']
]) check(src, T(src), exp);

console.log('\n── ④ 字形层兜底（没有用词差异的词保持正常简体）──');
for (const [src, exp] of [
  ['統計', '统计'],
  ['移動速度', '移动速度'],
  ['能量護盾', '能量护盾'],
  ['天賦樹', '天赋树'],
  ['挑戰聯盟', '挑战联盟'],
  ['這是一個繁體字測試', '这是一个繁体字测试']
]) check(src, T(src), exp);

console.log('\n── ⑤ 边界：开关与语言门槛 ──');
check('关闭替换后完全不动', (() => {
  api.setReplace(false); const g = T('資訊 搜尋 能力值'); api.setReplace(true); return g;
})(), '資訊 搜尋 能力值');
check('英文页面不动', (() => {
  api.setPageLang(false); const g = T('資訊'); api.setPageLang(true); return g;
})(), '資訊');
check('纯英文不受影响', T('Twisters fired at the same time can merge'),
  'Twisters fired at the same time can merge');
check('繁中专用名不被通用层误伤', T('煉獄戰吼'), '炽焰战吼');

const pass = results.filter(Boolean).length;
console.log(`\n${pass}/${results.length} 通过`);

// ── 量化：poe.ninja /zh-tw 真实页面片段里，用词层命中了多少汉字 ──
// 取自用户截图与 poe.ninja /zh-tw/ 角色页正文
const SAMPLE = [
  '經濟', '流派', '天賦樹', '返回搜尋', '上一個', '下一個', '時光機', '最新快照',
  '個人資料', '帳號', '上次取得', 'PATH OF BUILDING 匯入代碼', '流派規劃器',
  '統計', '角色', '能力值', '移動速度', '物品稀有度', '能量球', '防禦', '生命',
  '能量護盾', '魔力', '精魂', '護甲', '傷害減免', '閃避值', '閃避機率', '格擋',
  '物理視為', '抗性', '有效生命池', '最大承受擊中', '恢復', '生命回復', '魔力回復',
  '生命偷取', '能量護盾充能', '主要技能', '持續時間', '範圍半徑', '每秒 次數',
  '資訊', '設定', '進階選項', '重新整理', '載入中', '登入', '伺服器', '資料庫',
  '鋼鐵守護', '碎骨', '風魔舞者', '拾荒者護板', '灰燼之捷', '堅韌之吼'
];
const h2s = JSON.parse(readFileSync(join(ROOT, 'data/h2s_packed.json'), 'utf8'));
const H = {}; for (let i = 0; i < h2s.length; i += 2) H[h2s[i]] = h2s[i + 1];
const glyph = (s) => [...s].map((c) => H[c] || c).join('');
const wording = JSON.parse(readFileSync(join(ROOT, 'data/zh-wording.json'), 'utf8')).map;
const tencent = JSON.parse(readFileSync(join(ROOT, 'data/tencent.json'), 'utf8'));
const poedb = JSON.parse(readFileSync(join(ROOT, 'data/tw2cn_poedb.json'), 'utf8'));

let totalCJK = 0, differing = 0;
const shown = [];
for (const src of SAMPLE) {
  const got = T(src);
  const base = glyph(src);
  totalCJK += (src.match(/[㐀-鿿]/g) || []).length;
  if (got !== base) {
    differing += (src.match(/[㐀-鿿]/g) || []).length;
    if (shown.length < 12) shown.push(`${src} → ${got}（字形层只会给 ${base}）`);
  }
}
console.log('\n── 量化 ──');
console.log(`样本 ${SAMPLE.length} 条 / 汉字 ${totalCJK} 个`);
console.log(`走「用词层」而非字形层的汉字：${differing} 个（${(differing / totalCJK * 100).toFixed(1)}%）`);
console.log('差异示例：');
for (const l of shown) console.log('  ' + l);

process.exit(pass === results.length ? 0 : 1);
