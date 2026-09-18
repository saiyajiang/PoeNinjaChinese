# PoeNinjaChinese

> 给 [poe.ninja](https://poe.ninja) 做中文化的油猴脚本，词库取自 **poedb.tw / poe2db.tw**（流亡编年史）。

简体 / 繁體一键切换，界面文案、物品名、通货、技能宝石、地图、基底类型全覆盖；鼠标悬停可看英文原文，搜索框也能直接搜中文。

---

## 功能

| | 说明 |
|---|---|
| **三层翻译** | ① 拦截页面自己的 `/api/` 响应，在数据进前端前改字段（搜索/排序/筛选直接吃中文）<br>② DOM 文本节点替换，兜底覆盖表格、弹窗、懒加载内容<br>③ 内置界面文案词典，断网也能翻按钮和表头 |
| **中文来源** | **腾讯官方优先**：国服市集 API 的官方简体译名；官方没有的再降级到 poedb.tw / poe2db.tw |
| **跨节点合并** | poe.ninja 把数值高亮拆成多个 `<span>`，脚本会把相邻文本片段拼起来做最长匹配 |
| **通用术语** | 约 400 条游戏术语（伤害/充能/钉住/破防…），大小写不敏感，专治被数值高亮拆碎的词缀 |
| **语言** | 简体、繁體、关闭，右下角按钮循环切换（记住偏好） |
| **保留原文** | 翻译后的节点 `title` 里保留英文，鼠标悬停即可对照；可关 |
| **未翻译收集** | `Alt + 点击`右下按钮（或油猴菜单）导出未命中字符串，方便补词条 |
| **PoE1 / PoE2** | 按 URL 自动识别 `/poe1`、`/poe2`，切换到对应词库源站 |

## 安装

1. 浏览器装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey / 脚本猫）
2. 从 GitHub 直装：打开下面的「脚本直链」，Tampermonkey 会自动识别并跳转到安装页
3. 或者手动安装：新建脚本 → 粘贴 `PoeNinjaChinese.user.js` 全部内容 → 保存
4. Greasyfork：在 Greasyfork 投稿时选「从 URL 导入」，填脚本直链即可，后续随 `@updateURL` 自动同步

> 首次打开 poe.ninja 会自动从 poedb.tw 拉一次词库（约几百 KB，之后缓存 7 天）。

## 使用

- **右下角按钮**：点击在 `译·简 → 譯·繁 → 译·关` 之间切换；`Alt + 点击` 导出未翻译字符串
- **油猴菜单**：
  - 立即更新词库（CDN）
  - 直接从 PoEDB 同步词库（绕过缓存，现场抓最新）
  - 翻译接口数据 开/关（关掉后只做页面文字翻译）
  - 悬浮显示英文原文 开/关
  - 导出未翻译字符串 / 清除缓存 / 关于

## 中文译名从哪来

**第一优先：腾讯官方（国服）**。脚本运行时会取 `https://poe.game.qq.com/api/trade/data/`：

- `/items` —— 官方简体物品名，按「分组序号 + 组内序号」与国际服数据对齐
  （组数或组内条数不一致就整组跳过，宁缺勿错）
- `/stats` —— 官方简体词缀文本，两端 `id` 完全一致，可**精确对齐**，用来翻词缀

国服接口需要登录态（POESESSID）。**没登录国服就会静默失败并自动降级到 poedb**，
不会打扰你——想让官方译名生效，先在浏览器登录一次国服官网即可。

**第二优先：poedb.tw / poe2db.tw**。官方没有的（比如 PoE2 的全部内容，国服尚未引进），
由编年史的公开 autocomplete 词表补齐，按 slug 做英→中对齐。

菜单里可以手动触发：「🇨🇳 同步词库（腾讯官方优先，PoEDB 补缺）」或「🌏 只从 PoEDB 同步」。

## 词库怎么更新

三种途径，任选：

1. **自动**：GitHub Actions 每周一跑 `tools/build-dict.mjs`，把 `data/dict.min.json` 推回仓库，脚本缓存到期后自动取新版
2. **手动**：脚本菜单「🌏 直接从 PoEDB 同步词库」，绕过仓库直接抓 poedb.tw（首次安装会自动走一次这一步）
3. **本地构建**：
   ```bash
   node tools/build-dict.mjs                 # PoE1，源站 poedb.tw
   node tools/build-dict.mjs --poe2          # PoE2，源站 poe2db.tw
   node tools/build-dict.mjs --local ./snap  # 用本地快照离线构建
   ```
   产物：`data/dict.json`（带缩进，方便 diff）与 `data/dict.min.json`（脚本加载用）

   源策略：`--source both`（默认，腾讯优先）/ `tencent` / `poedb`；
   国服接口要登录时可传 `--cookie "POESESSID=xxx"`。
   注意：腾讯官方只提供**简体**，繁体仍然全部来自 poedb。

**改译名**请改 `data/overrides.json`（优先级最高，覆盖官方翻译），改完重新构建；补界面文案改 `data/ui.json`。

> ⚠️ 工作流文件目前放在 `workflows/update-dict.yml`，GitHub 只识别 `.github/workflows/` 下的文件。
> clone 到本地后执行一条命令即可启用自动更新（也可以在仓库网页上直接手动触发一次 Actions）：
> ```bash
> mkdir -p .github/workflows && git mv workflows/update-dict.yml .github/workflows/ && rmdir workflows
> ```

## 开发

```bash
node tools/smoke-test.mjs   # 冒烟测试：在 Node 里用 DOM stub 跑翻译核心
node tools/coverage.mjs 未翻译导出.json   # 用真实页面的导出文件测覆盖率
node tools/build-dict.mjs   # 从 poedb.tw 构建物品名词库
node tools/sync-inline.mjs  # 把 data/*.json 写回脚本内置区块（--check 只校验）
```

`data/` 是词库的单一数据源：改 JSON → 跑 `sync-inline` → 脚本内置生效，不要手改脚本里的数组。

```
data/ui.json       界面文案 + 专有名词（精确/小写匹配，417 条）
data/terms.json    通用术语（小写匹配，大小写不敏感，约 400 条）
data/overrides.json  人工纠错层（优先级最高）
```

脚本结构（单文件，按编号分节）：

```
0 常量配置      1 GM API 封装   2 内置 UI 词典   3 运行时状态
4 词库加载      5 翻译核心      6 数据层拦截     7 DOM 层
8 悬浮按钮      9 菜单与工具    10 启动
```

浏览器控制台里可以用 `__PoeNinjaChinese.translatePhrase('Tabula Rasa')` 自查命中情况。

## 发布

仓库地址：https://github.com/saiyajiang/PoeNinjaChinese
脚本直链：https://raw.githubusercontent.com/saiyajiang/PoeNinjaChinese/main/PoeNinjaChinese.user.js

**fork 后必做**：脚本顶部 `const OWNER = 'saiyajiang'` 换成你自己的用户名，同时改 `@namespace`、`@downloadURL`、`@updateURL`、`@homepageURL`、`@supportURL`，否则自动更新和 CDN 词库都会指向原仓库。

发 Greasyfork 时注意：

- `@downloadURL` / `@updateURL` 必须与仓库里的文件路径一致，否则自动更新失效
- Greasyfork 会校验 `@license`，本脚本为 MIT
- 版本号改动后 Greasyfork 才会推送更新

## 已知限制 / TODO

- **语序**：poe.ninja 把数值与词缀拆进不同 span，只能逐节点翻译，输出形如「30% 提高 全域 伤害」，
  而非「提高 30% 全域伤害」。彻底解决需要引入 poedb 的词缀（mod）词库做整行匹配
- **技能描述长句**：整句描述（如技能说明段落）不在词库覆盖范围内，仍是英文
- 稀有物品的随机名（`Phoenix Wound` 之类）**故意不翻译**，避免误导
- 品牌名、账号名、角色名不翻译
- poe.ninja 改版换接口路径时，数据层可能失效，DOM 层会自动兜底

## 版权与致谢

- 脚本本体：MIT
- 词库数据：[poedb.tw](https://poedb.tw) / [poe2db.tw](https://poe2db.tw)，内容以 CC BY-NC-SA 3.0 发布
- 游戏文本版权归 Grinding Gear Games 所有，本项目仅作非商业的个人辅助用途
