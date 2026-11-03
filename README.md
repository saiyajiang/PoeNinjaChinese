# PoeNinjaChinese

> 把 [poe.ninja](https://poe.ninja) 的**官方繁體中文版**转换成**简体中文（腾讯国服译名优先）**的油猴脚本。
>
> **只在官方繁體中文页面生效**：站顶 Language 切到 English 时脚本自动停手，一个字都不替换。
> 脚本本身只有「替换 / 不替换」一个开关 —— 页面用哪种语言，交给 poe.ninja 站顶决定。

[![Greasyfork](https://img.shields.io/badge/Greasyfork-安装-7c3aed)](https://greasyfork.org/zh-CN/scripts/596361)

---

## 为什么是 v2

poe.ninja 在 **2026-10-30** 上线了官方多语言支持（含繁體中文，站顶 `Language` 选择器）。
页面文字本身已经是中文了，旧版「英文 → 中文」的大词库替换就不再必要——而且它有个绕不过去的短板：
**只有词库里收录的条目才能翻**，官方新加的物品、词缀、基底类型一律漏掉。

v2 把架构翻过来：以官方繁中为源，整页转换，覆盖面上从「词库命中」变成「整页文字」。

| | v1（`old` 分支） | v2（`main`） |
|---|---|---|
| 输入 | 英文页面 | **官方繁體中文页面** |
| 主逻辑 | 英文 → 中文，靠词库逐条查 | **繁 → 简**（用词对照 + 字形转换） |
| 覆盖 | 词库里有的才翻 | 整页中文全部转简，不依赖词库 |
| 残留英文 | 主要缺口 | 只作兜底，用旧词库补 |
| 译名来源 | 腾讯官方 + 编年史 | 腾讯国服优先，编年史 `/cn/` 兜底 |

> **v1 完整源码在 [`old` 分支](https://github.com/saiyajiang/PoeNinjaChinese/tree/old)**（含 1.0.0–1.8.1 全部历史）。
> `main` 只保留 v2。

---

## 功能

| | 说明 |
|---|---|
| **① 腾讯国服层（最高优先）** | `data/tencent.json` + 运行时从国服 API 同步到的简体译名，按英文键与繁中词库对齐后动态补入。**命中即停，不再看编年史** |
| **② 编年史层（官方没有才用）** | `data/tw2cn_poedb.json`，560 条真正的用词差异，最长匹配。例如 `鋼鐵守護 → 钢铁看守`、`骷髏巨獸 → 魔侍蛮兵`、`萊基亞塔的流動 → 拉其塔之流`、`碎骨 → 七伤破` |
| **③ 字形层** | 剩余繁体字逐字转简，3419 个简繁异体字，覆盖 CJK 基本区。例如 `風暴編織者 → 风暴编织者`、`每秒攻擊次數 → 每秒攻击次数` |
| **整页每一个「字」都转简** | 不只是词条命中 —— 所有文本节点逐字扫描，剩余繁体字一律走字形层。`這是一個繁體字測試 → 这是一个繁体字测试` |
| **只在中文页面替换** | 靠**正文汉字数量 / 占比**判定（繁→简只换字形，汉字数不变，信号不会自我消解）。切到 English 立刻停手，切回繁中立刻恢复；页面未渲染完也不动手 |
| **残留英文兜底** | 官方繁中尚未翻译的新物品 / 词缀仍是英文，这部分继续用旧词库翻译（仅中文页面生效） |
| **只有一个开关：替换 / 不替换** | 页面语言由 poe.ninja 站顶控制，脚本**不再**自带简/繁/英三态。右下角按钮和油猴菜单都是两态切换 |
| **保留原文** | 转换后的节点 `title` 保留官方繁体，鼠标悬停可对照；可关 |
| **图标安全** | 数据层默认关闭——poe.ninja 用 `name` 查技能图标与描述，改成中文会导致技能丢图标和描述 |
| **PoE1 / PoE2** | 按 URL 自动识别 `/poe1`、`/poe2` |
| **脚本图标** | 暗底圆角 + PoE 金边 + 金色「译」字，`@icon` 内联 data URI，无需联网 |

---

## 安装

1. 浏览器装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey / 脚本猫）
2. **从 Greasyfork 安装（推荐，带自动更新）**：
   [https://greasyfork.org/zh-CN/scripts/596361](https://greasyfork.org/zh-CN/scripts/596361)
3. 或 GitHub 直装：打开[脚本直链](https://raw.githubusercontent.com/saiyajiang/PoeNinjaChinese/main/PoeNinjaChinese.user.js)
4. 或手动新建脚本，粘贴 `PoeNinjaChinese.user.js` 全部内容

> ⚠️ **先在 poe.ninja 站顶把 `Language` 切成「繁體中文」**。
> 若仍是 English，脚本会刻意完全停手 —— 这是设计，不是故障：方便你随时切回英文原版。
> 点菜单「⚠️ 页面语言：需切「繁體中文」才替换（点此检测）」可查看当前判定与采样数据。

仓库：https://github.com/saiyajiang/PoeNinjaChinese

---

## 使用

- **右下角按钮**：`替换` ⇄ `不替换` 两态；`Alt + 点击` 导出未翻译字符串。
  English 页面会变成虚线框并带 `!` 前缀，tooltip 写明当前页面语言与开关状态
- **油猴菜单**：
  - ⚠️ **页面语言：需切「繁體中文」才替换（点此检测）** —— 显示 `<html lang>`、汉字数、占比与判定
  - 🔁 **替换 / 不替换** —— 与右下角按钮同一个开关
  - 🔄 更新词库（CDN 词库 → 腾讯官方 → PoEDB 补缺）
  - 🔍 诊断词库源 —— 页面语言判定、三层词库各自条数、繁转简抽验
  - 📡 翻译接口数据 开/关（默认关，见「图标安全」）
  - 🏷 悬浮显示原文 / 🧩 跨节点合并 / 📤 导出未翻译 / 🧹 清除缓存 / ℹ️ 关于

> **想看英文原版**：站顶 Language 切 English 即可，脚本在 1.5 秒内自动停手，
> 之后一个字都不会替换；刷新一次就能看到完整英文页面。切回「繁體中文」会自动恢复替换。

---

## 译名从哪来

**第一优先：腾讯国服**。脚本运行时取国服市集 API（`/api/trade/data/items`、`/stats`）拿官方简体译名，
与「英文 → 繁中」词库按英文键对齐，动态生成「繁中 → 简中」映射并覆盖编年史用词。
国服接口需要登录态（POESESSID），取不到就静默降级。

**第二优先：编年史 `/cn/`**。`data/gems.json`（977 条技能/精魂/辅助宝石，含 cn 与 tw）
和 `data/ui.json`（601 条界面文案）已按英文对齐出两套译名，构建时转成用词对照表。

**第三层：字形转换**。前两层没覆盖的普通文本，按 3419 字单字表逐字转简。

> 已知限制：PoE2 国服 trade 接口此前诊断只对齐到 3/10 组，可用性有限；
> 因此 PoE2 大部分简体用词来自编年史 `/cn/`（与国服简中同源）。
> 需要精确国服叫法的条目，直接填进 `data/tencent.json` 即可，优先级最高。

---

## 词库怎么改

改 `data/tencent.json`（腾讯国服层）或 `data/overrides.json`（人工纠错）后：

```bash
pip install zhconv
python3 tools/build-conversion.py   # 重建 h2s_packed / tencent / tw2cn_poedb / tw2cn
node tools/sync-inline.mjs          # 写回脚本内联区块
node tools/smoke-test.mjs           # 冒烟测试
node tools/lang-test.mjs            # 页面语言切换 / 替换开关测试
```

文件结构：

```
PoeNinjaChinese.user.js   脚本本体（MIT，单文件可用）
data/h2s_packed.json      繁→简 单字表（紧凑编码，3419 字）
data/tw2cn_poedb.json     编年史层用词对照（560 条）
data/tw2cn.json           两层合并参考表（脚本不直接读）
data/tencent.json         腾讯国服层（最高优先，可直接编辑）
data/gems.json            技能宝石简繁双语（977 条）
data/ui.json              界面文案简繁双语（601 条）
data/terms.json           通用术语（556 条）
data/overrides.json       人工纠错层
tools/build-conversion.py 转换表构建
tools/sync-inline.mjs     内联词库同步
tools/smoke-test.mjs      冒烟测试
tools/lang-test.mjs       页面语言切换 / 替换开关测试
tools/coverage.mjs        覆盖率检查
assets/                   图标资源
```

---

## 已知限制

- **必须先切官方繁體中文**，否则脚本完全不覆盖（这是刻意设计：方便随时切回英文原版）
- 切到 English 时，脚本已改写的节点无法还原成繁体，刷新一次页面即可看到完整英文原版
- 官方繁中本身没翻译的新物品/词缀仍是英文，由旧词库兜底，覆盖不全
- 569 条用词对照来自编年史 `/cn/` 与 `/tw/` 对齐，少量条目可能有版本差异；
  发现错译请填 `data/tencent.json`
- 字形转换只覆盖 CJK 基本区（游戏文本不会出现扩展区生僻字）
- 部分辅助宝石译名来自按序对齐，个别可能错位

---

## 分支与发布

| 分支 | 内容 |
|---|---|
| `main` | v2.0.0+（繁转简），当前 2.2.0 |
| `old` | v1.0.0–1.8.1 完整历史（英译中） |

Greasyfork 若当初是「从 URL 导入」，会自动跟 `main` 同步；
若是粘贴源码，需要手动重新提交一次。

### 本地推送 v2

v1 曾通过 GitHub API 逐文件提交，远程 `main` 与本地 git 历史可能不完全一致。
最稳妥的做法（不会遇到 non-fast-forward）：

```bash
# 1) 在 GitHub 网页上：Branches → New branch，基于 main 建 old
# 2) 本地重新对齐远程，再覆盖 v2 文件
git fetch origin
git reset --hard origin/main
#    把 v2 的文件（PoeNinjaChinese.user.js、data/、tools/、README.md、CHANGELOG.md）覆盖进来
git add -A
git commit -m "feat: v2.0.0 官方繁体→简体中文（腾讯国服译名优先）"
git push origin main
```

若已确认本地 `old` 分支就是要归档的版本，也可以一并推：`git push origin old`。

---

## 版权与致谢

- 译名数据来自 [poedb.tw](https://poedb.tw) / [poe2db.tw](https://poe2db.tw)（CC BY-NC-SA 3.0）
  与腾讯国服官方数据
- poe.ninja 官方繁體中文版由 poe.ninja 提供
- 本站与 Grinding Gear Games、腾讯、poe.ninja 均无隶属关系
- 脚本本体 MIT License
