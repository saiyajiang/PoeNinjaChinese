#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重建「官方繁體 → 简体中文」转换表。

数据来源（都在 data/ 下）：
  gems.json      技能/精魂/辅助宝石，每条 {cn, tw}
  ui.json        界面文案，cn / tw 两个语言桶
  overrides.json 人工纠错层，其中 tw→cn 视为腾讯国服叫法，优先级最高

产出：
  data/h2s_packed.json      繁→简 单字表（紧凑字符串，每 2 字符一组「繁+简」）
  data/tencent.json         腾讯国服层 {繁体词: 简体词}  ← 查表时优先级最高
  data/tw2cn_poedb.json     编年史层 {繁体词: 简体词}    ← 腾讯层查不到才用
  data/tw2cn.json           两层合并（仅供参考，脚本不直接读）

改完 data/*.json 后依次执行：
  python3 tools/build-conversion.py
  node tools/sync-inline.mjs

依赖：pip install zhconv
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')

try:
    import zhconv
except ImportError:
    sys.exit('缺少依赖，请先执行：pip install zhconv')


def load(name):
    with open(os.path.join(DATA, name), encoding='utf8') as f:
        return json.load(f)


def save(name, obj):
    with open(os.path.join(DATA, name), 'w', encoding='utf8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    print(f'  ↳ 已写 data/{name}')


# ── 1. 单字表 ────────────────────────────────────────────────
# 只要 CJK 基本区；且两侧都必须是单个 BMP 码元。
# 增补平面字符（U+20000+）在 JS 里占 2 个 UTF-16 码元，
# 会让「每 2 字符一组」的打包方式整体错位，必须排除。
h2s = {}
for cp in range(0x4E00, 0xA000):
    ch = chr(cp)
    s = zhconv.convert(ch, 'zh-hans')
    if s == ch or len(s) != 1:
        continue
    if ord(ch) > 0xFFFF or ord(s) > 0xFFFF:
        continue
    h2s[ch] = s
packed = ''.join(k + v for k, v in sorted(h2s.items()))
assert len(packed) == len(h2s) * 2
print(f'单字表：{len(h2s)} 字，编码 {len(packed)} 字符')
save('h2s_packed.json', packed)


def shape_t2s(t):
    """只看字形转换的结果（用来判断是否需要进用词对照表）"""
    return ''.join(h2s.get(c, c) for c in t)


# ── 2. 用词对照：只收「字形转换后仍不同」的条目 ──────────────
gems = load('gems.json')
ui = load('ui.json')

tw2cn = {}
for en, v in gems.items():
    if not isinstance(v, dict):
        continue
    tw, cn = (v.get('tw') or '').strip(), (v.get('cn') or '').strip()
    if tw and cn and tw != cn and shape_t2s(tw) != cn:
        tw2cn[tw] = cn

for en, cn in ui['cn'].items():
    tw = (ui.get('tw', {}).get(en) or '').strip()
    cn = cn.strip()
    if tw and cn and tw != cn and shape_t2s(tw) != cn:
        tw2cn[tw] = cn

print(f'编年史层（英文对齐出的用词差异）：{len(tw2cn)} 条')
save('tw2cn_poedb.json', tw2cn)

# ── 3. 腾讯国服层（最高优先）────────────────────────────────
# overrides 里的 cn 本来就是国服/大陆玩家习惯叫法，tw 是对应繁体。
ov = load('overrides.json')
tencent = {}
for en, tw in ov.get('tw', {}).items():
    cn = ov.get('cn', {}).get(en)
    tw, cn = tw.strip(), (cn or '').strip()
    if tw and cn and tw != cn:
        tencent[tw] = cn
print(f'腾讯国服层：{len(tencent)} 条')
save('tencent.json', tencent)

# 两层分开存，脚本查表时先腾讯再编年史；这里额外留一份合并结果便于人工查看
merged = dict(tw2cn)
merged.update(tencent)
save('tw2cn.json', merged)
print(f'合并参考表：{len(merged)} 条')

print('\n完成。接着执行：node tools/sync-inline.mjs')
