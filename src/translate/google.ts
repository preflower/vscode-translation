const vscode = require('vscode');
const translate = require('translation-google');
translate.suffix = 'cn';
const language = vscode.workspace.getConfiguration().get('easy-translator.defaultLanguage')

export default async function google(pendingText: string) {
  let pre = `**[谷歌翻译](https://translate.google.cn/?sl=auto&tl=${language}&text=${escape(pendingText)})**\n\n`;
  let { text } = await translate(pendingText, {
    to: language,
  });
  return pre + text;
}