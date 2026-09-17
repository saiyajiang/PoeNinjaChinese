# Changelog

本项目版本号遵循 [SemVer](https://semver.org/)。

## 1.0.0

- 首个可用版本
- 三层翻译：接口数据层 / DOM 文本层 / 界面文案层
- 词库取自 poedb.tw（PoE1）与 poe2db.tw（PoE2），按 slug 做英→中对齐
- 简体 / 繁體 / 关闭 三态切换，右下角悬浮按钮 + 油猴菜单
- 鼠标悬停保留英文原文
- `Alt + 点击`导出未翻译字符串
- 词库本地缓存 7 天，支持 CDN 更新与直接从 PoEDB 同步
- 配套 `tools/build-dict.mjs`（构建）与 `tools/smoke-test.mjs`（冒烟测试）
