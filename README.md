 # vscode-translation

A simple translation extension for VS Code

![Easy Translator](./assets/screenshot.gif)

## How to work

1. Search `Easy Translator` in Extensions
or Open [Easy Translator](https://marketplace.visualstudio.com/items?itemName=preflower.vscode-translation) link
2. Install it

## Extension Settings

This extension contributes the following settings:

* `easy-translator.defaultLanguage`: Translate other languages ​​into this language.
* `easy-translator.covertedLanguage`: If the text language is the same as the default language, convert to that language.
* `easy-translator.dictionary`: Configure available dictionary libraries.

| Configure | Default | Options |
|-|-|-|
| easy-translator.defaultLanguage | zh-cn | en<br>zh-cn
| easy-translator.covertedLanguage | en | en(english)<br>zh-cn(chinese)<br>jap(japanese)<br>fr(french)<br>ko(korea): only support in YouDao
| easy-translator.dictionary | ['YouDao', 'Bing', 'Google', 'Linguee'] | YouDao<br>Bing<br>Google<br>Linguee

## Release Notes

### 1.0.0
- 新增 Google 翻译
- 新增 YouDao 词典
- 新增 Linguee 词典
- 新增 Bing 词典
- 新增 默认转换后语言(covertedLanguage) 配置项
- 新增 母语(defaultLanguage) 配置项
- 新增 字典（dictionary) 配置项
- 支持 母语 与其他语言互译
- 因国内问题，Linguee翻译返回会较慢，所以母语设置为'en'会启动Linguee，母语设置为'cn'会启动YouDao、Bing，且词典列中必须有该词典