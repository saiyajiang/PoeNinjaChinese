#!/usr/bin/env node
/**
 * 把 data/ui.json 与 data/terms.json 写回脚本内置的 INLINE_UI / INLINE_TERMS 区块。
 *
 * 单一数据源原则：JSON 是权威，脚本里的内置数组由本工具生成，不要手改脚本里的数组。
 *   node tools/sync-inline.mjs            # 同步
 *   node tools/sync-inline.mjs --check    # 只检查是否一致（CI 用）
 *
 * 首次运行会把脚本里现存的 INLINE_UI 手工词条并入 data/ui.json，不会丢东西。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SCRIPT = join(ROOT, 'PoeNinjaChinese.user.js');
const CHECK = process.argv.includes('--check');

const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'));
let code = readFileSync(SCRIPT, 'utf8');

/** 从脚本源码里取出形如 `const NAME = [ ... ];` 的数组字面量 */
function extractArray(name) {
  const start = code.indexOf(`const ${name} = [`);
  if (start < 0) return null;
  const open = code.indexOf('[', start);
  let depth = 0, i = open;
  for (; i < code.length; i++) {
    if (code[i] === '[') depth++;
    else if (code[i] === ']') { depth--; if (depth === 0) break; }
  }
  // 源码里是合法 JS 数组字面量，直接求值最稳（词条里的 ' 不能被当成引号替换）
  const raw = code.slice(open, i + 1).replace(/^\s*\/\/.*$/gm, '');
  return new Function('return ' + raw)();
}

// 1) 把脚本里现存的手工词条并入 JSON（JSON 已有同名键时以 JSON 为准）
const ui = readJSON(join(ROOT, 'data/ui.json'));
const terms = readJSON(join(ROOT, 'data/terms.json'));
const legacy = extractArray('INLINE_UI') || [];
let merged = 0;
for (const row of legacy) {
  const [en, cn, tw] = row;
  if (!en) continue;
  if (!ui.cn[en] && cn) { ui.cn[en] = cn; merged++; }
  if (!ui.tw[en] && tw) { ui.tw[en] = tw; }
}
if (merged) {
  writeFileSync(join(ROOT, 'data/ui.json'), JSON.stringify(ui, null, 1), 'utf8');
  console.log(`  ↳ 脚本内 ${merged} 条手工词条已并入 data/ui.json`);
}

const cmp = (a, b) => a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
const toRows = (map) => Object.keys(map)
  .filter((k) => !k.startsWith('_'))
  .sort()
  .map((k) => [k, map[k]])
  .sort(cmp);

/** 生成 JS 数组源码，按英文原词排序，便于 diff */
function render(name, lang) {
  const src = name === 'INLINE_UI' ? ui : terms;
  const keys = Object.keys(src.cn).filter((k) => !k.startsWith('_')).sort();
  const lines = keys.map((k) => {
    const en = name === 'INLINE_UI' ? k : k;
    const cn = src.cn[k], tw = src.tw[k] || src.cn[k];
    return `    [${JSON.stringify(en)}, ${JSON.stringify(cn)}, ${JSON.stringify(tw)}]`;
  });
  return `const ${name} = [\n${lines.join(',\n')}\n  ];`;
}

// 2) 替换脚本里的两个区块
function replace(src, name, block) {
  const beginTag = `/* ${name}:BEGIN */`;
  const endTag = `/* ${name}:END */`;
  const b = src.indexOf(beginTag);
  const e = src.indexOf(endTag);
  if (b < 0 || e < 0) throw new Error(`脚本里找不到 ${name} 区块标记，请先加上 ${beginTag} / ${endTag}`);
  return src.slice(0, b + beginTag.length) + '\n' + block + '\n  ' + src.slice(e);
}

const nextUI = render('INLINE_UI');
const nextTerms = render('INLINE_TERMS');
let out = replace(code, 'INLINE_UI', nextUI);
out = replace(out, 'INLINE_TERMS', nextTerms);

if (CHECK) {
  const same = out.trim() === code.trim();
  console.log(same ? '✅ 脚本内置词库与 data/*.json 一致' : '❌ 脚本内置词库已过期，请运行 node tools/sync-inline.mjs');
  process.exit(same ? 0 : 1);
}

writeFileSync(SCRIPT, out, 'utf8');
console.log(`✅ 已写回脚本：INLINE_UI ${Object.keys(ui.cn).filter(k=>!k.startsWith('_')).length} 条 / INLINE_TERMS ${Object.keys(terms.cn).filter(k=>!k.startsWith('_')).length} 条`);
