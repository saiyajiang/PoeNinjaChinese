# Changelog

本项目版本号遵循 [SemVer](https://semver.org/)。

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

实测：对一份 374 条的 poe2 角色页导出样本，覆盖率从 0% 提升到 **96%**；
未覆盖部分为品牌名、账号名、角色名与稀有物品随机名（本就不应翻译）。

## 1.0.0

- 首个可用版本
- 三层翻译：接口数据层 / DOM 文本层 / 界面文案层
- 词库取自 poedb.tw（PoE1）与 poe2db.tw（PoE2），按 slug 做英→中对齐
- 简体 / 繁體 / 关闭 三态切换，右下角悬浮按钮 + 油猴菜单
- 鼠标悬停保留英文原文
- `Alt + 点击`导出未翻译字符串
- 词库本地缓存 7 天，支持 CDN 更新与直接从 PoEDB 同步
- 配套 `tools/build-dict.mjs`（构建）与 `tools/smoke-test.mjs`（冒烟测试）
