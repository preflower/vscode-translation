const translate = require('translation-google');
const { checkLanguage } = require('../utils/helper');

translate.suffix = 'cn';

export default async function google(pendingText: string) {
  const to = checkLanguage(pendingText);
  let pre = `**[谷歌翻译](https://translate.google.cn/?sl=auto&tl=${to}&text=${escape(pendingText)})**\n\n`;
  try {
    let { text } = await translate(pendingText, {
      to,
    });
    if (text) return pre + text;
  } catch {
    return;
  }
}