#!/usr/bin/env node
/**
 * 从 poedb.tw / poe2db.tw 生成 PoeNinjaChinese 用的词库。
 *
 *   node tools/build-dict.mjs                    # 默认拉 poedb.tw（PoE1）
 *   node tools/build-dict.mjs --poe2             # 拉 poe2db.tw（PoE2）
 *   node tools/build-dict.mjs --host https://poedb.tw --out data/
 *
 * 产物：
 *   data/dict.json      带缩进，方便 diff / 手工改
 *   data/dict.min.json  压缩版，脚本运行时加载这个
 *
 * 数据来源：poedb.tw 公开的 autocomplete 词表（CC BY-NC-SA 3.0）。
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const flag = (name) => argv.includes('--' + name);

const POE2 = flag('poe2');
const HOST = (arg('host', POE2 ? 'https://poe2db.tw' : 'https://poedb.tw')).replace(/\/+$/, '');
const OUT = arg('out', join(ROOT, 'data'));
const BETA = HOST.includes('poe2db') ? '_cb' : '';   // PoE2 词表带 _cb 后缀
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function getJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json,*/*', Referer: HOST + '/' }
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** 逐个尝试候选地址，全失败才抛错 */
async function autocomplete(lang) {
  // --local <dir>：直接从本地目录读 autocomplete_<lang>.json，便于离线构建 / 用自己抓的快照
  const localDir = arg('local', '');
  if (localDir) {
    const p = join(localDir, `autocomplete_${lang}.json`);
    const data = JSON.parse(await readFile(p, 'utf8'));
    console.log(`  ✓ ${lang} ← ${p}（${data.length} 条）`);
    return data;
  }
  const cands = [
    `${HOST}/json/autocomplete${BETA}_${lang}.json`,
    `${HOST}/json/autocomplete_${lang}.json`
  ];
  let last;
  for (const url of cands) {
    try {
      const data = await getJSON(url);
      if (Array.isArray(data) && data.length) { console.log(`  ✓ ${lang} ← ${url}（${data.length} 条）`); return data; }
      last = new Error(`${url} 返回空数据`);
    } catch (e) { last = e; console.warn(`  · ${url} 失败：${e.message}`); }
  }
  throw last;
}

async function readOptionalJSON(path, fallback) {
  try { return JSON.parse(await readFile(path, 'utf8')); }
  catch (e) { return fallback; }
}

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/* ── 腾讯官方（国服）源 ────────────────────────────────────────
 * 国服市集 API 与国际服同构，返回腾讯官方简体译名：
 *   items：按「分组序号 + 组内序号」对齐（组/条数不一致则跳过该组）
 *   stats：两端 id 完全一致，按 id 精确对齐，用来翻词缀
 * 国服接口需要登录态（POESESSID），取不到就 fallback 到 poedb。
 * 可用 --cookie "POESESSID=xxx" 传入。
 */
const EN_API = 'https://www.pathofexile.com/api/trade/data/';
const CN_API = 'https://poe.game.qq.com/api/trade/data/';
const COOKIE = arg('cookie', '');

async function tradeData(base, name) {
  const headers = { 'User-Agent': UA, Accept: 'application/json' };
  if (COOKIE) headers.Cookie = COOKIE;
  const res = await fetch(base + name, { headers });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json.result) || !json.result.length) throw new Error(`${name}: 返回为空（多半是没登录国服）`);
  return json.result;
}

/** 按索引对齐两端；组数或组内条数不一致就整组放弃，宁缺勿错 */
function alignGroups(enList, cnList, pick) {
  const out = {};
  const usable = Math.min(enList.length, cnList.length);
  let groups = 0;
  for (let g = 0; g < usable; g++) {
    const ee = (enList[g] || {}).entries || [];
    const ce = (cnList[g] || {}).entries || [];
    if (ee.length !== ce.length || !ee.length) continue;
    for (let i = 0; i < ee.length; i++) pick(out, ee[i], ce[i]);
    groups++;
  }
  return { out, groups, of: usable };
}

async function fromTencent() {
  const [enItems, cnItems] = await Promise.all([tradeData(EN_API, 'items'), tradeData(CN_API, 'items')]);
  const items = alignGroups(enItems, cnItems, (out, e, c) => {
    const en = clean(e && (e.name || e.type));
    const cn = clean(c && (c.name || c.type));
    if (!en || !cn || en === cn) return;                 // 官方没翻的保持英文
    if (en.length > 60 || cn.length > 60) return;
    if (/[^A-Za-z0-9'’\- ]/.test(en)) return;            // 只收纯英文名
    if (!(en in out)) out[en] = cn;
  });
  console.log(`  ✓ 腾讯官方 物品：${Object.keys(items.out).length} 条（对齐 ${items.groups}/${items.of} 组）`);

  let stats = { out: {}, groups: 0, of: 0 };
  try {
    const [enStats, cnStats] = await Promise.all([tradeData(EN_API, 'stats'), tradeData(CN_API, 'stats')]);
    const cnById = new Map();
    for (const g of cnStats) for (const e of (g.entries || [])) {
      if (e && e.id && e.text) cnById.set(e.id, clean(e.text));
    }
    for (const g of enStats) for (const e of (g.entries || [])) {
      if (!e || !e.id || !e.text) continue;
      const cn = cnById.get(e.id), en = clean(e.text);
      if (!cn || !en || en === cn) continue;
      if (!(en in stats.out)) stats.out[en] = cn;
    }
    console.log(`  ✓ 腾讯官方 词缀：${Object.keys(stats.out).length} 条`);
  } catch (e) { console.warn(`  · 腾讯官方 词缀 跳过：${e.message}`); }

  return Object.assign({}, items.out, stats.out);
}

async function main() {
  const SOURCE = arg('source', 'both');   // tencent | poedb | both（both = 腾讯优先）
  console.log(`▶ 源策略：${SOURCE}${SOURCE !== 'poedb' ? '（腾讯官方优先）' : ''}　PoE 版本：${POE2 ? 'PoE2' : 'PoE1'}`);

  // ① 腾讯官方（国服）——只提供简体
  let official = {};
  if (SOURCE !== 'poedb') {
    try { official = await fromTencent(); }
    catch (e) { console.warn(`  · 腾讯官方源不可用：${e.message}`); if (SOURCE === 'tencent') throw e; }
  }

  // ② poedb.tw —— 繁体 + 补官方缺的简体
  let en2cn = {}, en2tw = {};
  if (SOURCE !== 'tencent' || !Object.keys(official).length) {
    console.log(`▶ 源站：${HOST}（${POE2 ? 'PoE2' : 'PoE1'}）`);
    const us = await autocomplete('us');
    const cn = await autocomplete('cn');
    const tw = await autocomplete('tw');

    // 英→中 映射：靠 slug（value）对齐，value 在所有语言里一致
    const enBySlug = new Map();
    for (const it of us) {
      if (it && it.value) enBySlug.set(it.value, clean(it.label));
    }

    const build = (zhList) => {
      const out = {};
      for (const it of zhList) {
        if (!it || !it.value || !it.label) continue;
        const en = enBySlug.get(it.value);
        const zh = clean(it.label);
        if (!en || !zh || en === zh) continue;          // 官方没翻译的保持英文
        if (en.length > 60 || zh.length > 60) continue; // 超长条目（多为说明性词条）丢弃
        if (/[<>]/.test(zh)) continue;
        if (!(en in out)) out[en] = zh;
      }
      return out;
    };

    const pdbCn = build(cn);
    const pdbTw = build(tw);
    // 简体：官方优先，poedb 只补缺
    en2cn = Object.assign({}, pdbCn, official);
    en2tw = pdbTw;
    const patched = Object.keys(pdbCn).filter((k) => k in official).length;
    console.log(`  ✓ poedb 简体 ${Object.keys(pdbCn).length} 条（其中 ${patched} 条被官方译名覆盖）／繁体 ${Object.keys(pdbTw).length} 条`);
  } else {
    en2cn = official;
  }

  const ui = await readOptionalJSON(join(OUT, 'ui.json'), { cn: {}, tw: {} });
  const terms = await readOptionalJSON(join(OUT, 'terms.json'), { cn: {}, tw: {} });
  const overrides = await readOptionalJSON(join(OUT, 'overrides.json'), { cn: {}, tw: {} });

  const payload = {
    v: 1,
    game: POE2 ? 'poe2' : 'poe1',
    source: Object.keys(official).length ? `tencent+${HOST}` : HOST,
    generatedAt: new Date().toISOString(),
    en2cn: Object.assign({}, en2cn, overrides.cn || {}),
    en2tw: Object.assign({}, en2tw, overrides.tw || {}),
    ui: { cn: ui.cn || {}, tw: ui.tw || {} },
    terms: { cn: terms.cn || {}, tw: terms.tw || {} },
    overrides: { cn: overrides.cn || {}, tw: overrides.tw || {} }
  };

  await mkdir(OUT, { recursive: true });
  const pretty = JSON.stringify(payload, null, 1);
  const min = JSON.stringify(payload);
  await writeFile(join(OUT, 'dict.json'), pretty, 'utf8');
  await writeFile(join(OUT, 'dict.min.json'), min, 'utf8');

  console.log(`✅ 写入 data/dict.json（${(pretty.length / 1024).toFixed(0)} KB）`);
  console.log(`✅ 写入 data/dict.min.json（${(min.length / 1024).toFixed(0)} KB）`);
  console.log(`   简体中文章节：${Object.keys(payload.en2cn).length} 条`);
  console.log(`   繁體中文章节：${Object.keys(payload.en2tw).length} 条`);
  console.log(`   界面词条：简 ${Object.keys(payload.ui.cn).length} / 繁 ${Object.keys(payload.ui.tw).length}`);
  console.log(`   通用术语：简 ${Object.keys(payload.terms.cn).length} / 繁 ${Object.keys(payload.terms.tw).length}`);
}

main().catch((e) => { console.error('❌ 构建失败：' + e.message); process.exit(1); });
