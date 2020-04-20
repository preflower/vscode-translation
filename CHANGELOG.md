# Change Log

All notable changes to the "vscode-translation" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.0.2
#### 优化
- 便捷化 支持中英互译
待转换语言 -> 转换后语言

#### 修复
- 修复当存在转译字符时，有道页面直接404导致其他翻译也不展示问题

## 1.0.0
正式版上线
#### 优化
- 新增 母语功能，支持母语与其他语语种互译 16号
  - 母语 中文、英文
  - 其他语种 中文、英文、日语、法语
- 新增 选择翻译功能（目前支持翻译：有道，必应，谷歌，Linguee）
- 新增 必应词典（感觉跟有道冲突，且只支持 中-英互译 不好用）
- 新增 Linguee词典 替换 有道词典 在其他语言上的翻译问题

## 1.0.2
#### 修复
- 修复 [有道翻译无法将其他语言，例如 日语转为 中文](https://github.com/preflower/vscode-translation/issues/3) 错误
- 修复 谷歌翻译互译问题
- 修复 有道翻译 在部分语言样式展示异常问题

## 1.0.3
#### 修复
- 修复 [当选中某个单词后，鼠标放到了其他单词上，会弹出选中部分的翻译](https://github.com/preflower/vscode-translation/issues/4) 错误