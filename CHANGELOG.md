# Changelog

本项目版本号遵循 [SemVer](https://semver.org/)。

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
