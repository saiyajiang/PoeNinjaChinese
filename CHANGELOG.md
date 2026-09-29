# Changelog

本项目版本号遵循 [SemVer](https://semver.org/)。

## 1.4.0

- **官方接口改为按版本切换域名 + 多候选探测**：PoE2 国服是 `poe2.qq.com`，
  接口域名与 PoE1（`poe.game.qq.com`）不同。现在会按 `/poe1` `/poe2` 选择候选列表并逐个探测，
  第一个真能取到数据的就用（英文侧同步探测 `trade2` / `trade` 两套路径）
- **新增「🔍 诊断词库源」菜单**：逐个探测英文源、中文源、poedb，报告每个域名的成败与
  对齐得到的译名条数，结果弹窗 + 导出。排查「为什么还是英文」先点这个
- **新增「📦 导出当前词库」菜单**：把运行时实际生效的英→中映射导出成 JSON，
  方便把官方译名内置进脚本（开发者补词库用）
- 内置词条补到 界面 536 / 术语 548：新增 48 颗 PoE2 血统辅助宝石（Lineage，英文名取自官方列表、
  中文名取自编年史与国服社区，音译一一对应）与一批 PoE2 通用词（精魂宝石/同伴/巨灵/气泡护盾等）

> 说明：国服与国际服内容同步、只是译名不同，所以官方词库在理论上是**全集**。
> 技能名没被翻译，几乎都是因为官方源没取到（多半是没登录国服）导致词库为空，
> 而不是官方缺词条。点「🔍 诊断词库源」即可确认。

## 1.3.1（文档）


- 已发布到 Greasyfork：https://greasyfork.org/zh-CN/scripts/596361
- README 顶部加安装徽章，「安装」章节把 Greasyfork 列为推荐入口，
  「发布」章节改为列出 Greasyfork / 仓库 / 直链三个地址
- 修正「使用」章节与实际菜单不一致的地方（同步源选项已在 1.3.0 移除）
- 词库条目数、致谢里的中文译名来源同步更新

## 1.3.0


- 补齐 `@description:zh-TW`（Greasyfork 投稿时会校验 zh-TW 非空，之前漏了导致报错）
- **去掉「选择同步源」的菜单项**：原来有「腾讯官方优先」和「只从 PoEDB」两个入口，现在合并成
  一个「🔄 更新词库」，内部固定按「腾讯官方 → poedb 补缺」的顺序跑，用户不用选
- 同时合并了原先独立的「立即更新词库（CDN）」，点一次就把两个源都拉齐
- 词条补齐：界面 494 条 / 术语 522 条。新增 PoE2 技能与辅助宝石（Pierce the Heart 穿心、
  Sealing 封印、Cannibalism 吞灵、Cold-Infused 冰霜灌注、Flow State 流动状态、
  Mindful Awareness 正念觉察等）、武器类别（连枷/锤/长杖/长矛/剑）、
  以及 `SupportClarityPlayerTwo` 一类内部 skill id
- **修正误翻**：`Phoenix` 从通用术语里移除（只保留 `Phoenix Claw` 精确词条），
  否则稀有物品随机名 `Phoenix Wound` 会被翻成「凤凰 Wound」这种半吊子结果
- 未翻译收集现在会跳过品牌名（poe.ninja / Discord）与驼峰形内部 ID，导出结果更干净
- `tools/coverage.mjs` 把「品牌名/角色名/内部 ID」单独归类，不算作真实缺口

实测覆盖率：poe2 角色页新样本 94.6%，poe1 样本 98.4%，poe2 旧样本 96.1%。

## 1.2.0

- **中文来源改为腾讯官方优先**：脚本运行时先取国服市集 API（`poe.game.qq.com/api/trade/data/`）
  的官方简体译名，`/items` 按分组+条目序号对齐、`/stats` 按 id 精确对齐（可翻词缀）；
  官方取不到（多半是没登录国服）或官方没翻的条目，才降级到 poedb.tw / poe2db.tw 补齐。
  菜单新增「🇨🇳 同步词库（腾讯官方优先，PoEDB 补缺）」与「🌏 只从 PoEDB 同步」
- **跨节点合并翻译**：poe.ninja 把数值高亮拆成 `<span>30%</span><span>increased</span>…`，
  单节点永远匹配不到完整词条。现在会把相邻文本片段拼起来做最长匹配，命中后写回首节点。
  可在菜单「🧩 跨节点合并翻译」里关掉
- **译文收尾**：自动去掉中文之间的多余空格（「护甲 破坏 III」→「护甲破坏 III」）
- 未翻译收集不再记录已半翻译的残留串，导出结果更干净
- 词条补齐：界面 470 条 / 术语 465 条。新增 `Herald of X`、`Purity of X` 等复合技能名，
  修正 `Less` 被误译为「收起」（应为「更少」）
- `tools/build-dict.mjs` 支持 `--source tencent|poedb|both`（默认 both）与 `--cookie`
- `tools/coverage.mjs` 区分「真实缺口」与「已半翻译残留串」

实测覆盖率：poe2 角色页样本 92.4%（上一版 0%），poe1 样本 97.6%。

## 1.1.0

- 新增 `data/terms.json` 通用术语词库（约 400 条，大小写不敏感），解决 poe.ninja 把数值拆成独立
  span 导致词缀碎成单词、只能逐字匹配失败的问题
- 界面词库扩充到 417 条：补齐 poe.ninja 站点文案（Time Machine / Build Planner / Effective Health
  Pool / Max Hit 等）与一批 PoE2 专有名词（血统辅助宝石、天赋、地图、任务）
- 单词级匹配放宽：命中界面/术语词库时不再要求首字母大写
- 新增 `tools/sync-inline.mjs`：以 `data/*.json` 为单一数据源，写回脚本内置的
  INLINE_UI / INLINE_TERMS 区块，支持 `--check` 供 CI 校验
- 新增 `tools/coverage.mjs`：用真实的未翻译字符串导出文件测覆盖率
- 未翻译收集过滤 CSS 片段与账号名，导出结果更干净
- PoEDB 词库同步改为静默失败，内置词库已足够兜底

## 1.0.0

- 首个可用版本
- 三层翻译：接口数据层 / DOM 文本层 / 界面文案层
- 词库取自 poedb.tw（PoE1）与 poe2db.tw（PoE2），按 slug 做英→中对齐
- 简体 / 繁體 / 关闭 三态切换，右下角悬浮按钮 + 油猴菜单
- 鼠标悬停保留英文原文
- `Alt + 点击`导出未翻译字符串
- 词库本地缓存 7 天，支持 CDN 更新与直接从 PoEDB 同步
- 配套 `tools/build-dict.mjs`（构建）与 `tools/smoke-test.mjs`（冒烟测试）
