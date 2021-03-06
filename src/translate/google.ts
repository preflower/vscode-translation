const translate = require('translation-google');
import { Languages, handlerTextLanguage, isInDictionary } from '../utils/helper';

translate.suffix = 'cn';

const languages: Languages = {
  'zh-cn': 'zh-CN',
  jap: 'ja',
};

export default async function google(pendingText: string) {
  if (!isInDictionary('Google')) {
    return;
  }
  const language = handlerTextLanguage(pendingText);
  const to = languages[language] || language;
  let pre = `**[Google Translate](https://translate.google.cn/?sl=auto&tl=${to}&text=${escape(
    pendingText
  )})**\n\n`;
  try {
    let { text } = await translate(pendingText, {
      to,
    });
    if (text) {
      return pre + text;
    }
  } catch {
    return;
  }
}
