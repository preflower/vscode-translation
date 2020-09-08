const vscode = require('vscode');
export const defaultLanguage = vscode.workspace
  .getConfiguration()
  .get('easy-translator.defaultLanguage');
export const covertedLanguage = vscode.workspace
  .getConfiguration()
  .get('easy-translator.covertedLanguage');
const dictionary = vscode.workspace
  .getConfiguration()
  .get('easy-translator.dictionary');

export interface Languages {
  [propName: string]: string;
}

interface RegExpLanguages {
  [propName: string]: RegExp;
}

const languages: RegExpLanguages = {
  jap: new RegExp('[\u0800-\u4E00]+'),
  'zh-cn': new RegExp('[\u4E00-\u9FA5]+'),
  en: new RegExp('[A-Za-z]+'),
  ko: new RegExp('[\uAC00-\uD7A3]+'),
};

export function checkLanguage(text: string) {
  for (let language in languages) {
    if (text.match(languages[language])) {
      return language;
    }
  }
  return 'en';
}

export function detectLanguage(text: string) {
  for (let language in languages) {
    if (text.match(languages[language])) {
      return language;
    }
  }
  return null;
}

// 判断是否是母语，如果是则返回互译语言，否则返回该语言（供Linguee, YouDao使用，因为from默认为母语）
export function handlerNeedCovertedLanguage(text: string) {
  const language = detectLanguage(text);
  if (language && language !== defaultLanguage) {
    return language;
  }
  return covertedLanguage;
}

// 判断是否是母语，如果是则返回互译语言，否则返回母语（供Google使用，因为from是auto自动检测）
export function handlerTextLanguage(text: string) {
  const language = detectLanguage(text);
  return language === defaultLanguage ? covertedLanguage : defaultLanguage;
}

// 判断语言是否在词典中
export function isInDictionary(name: string) {
  return ~dictionary.indexOf(name) ? true : false;
}
