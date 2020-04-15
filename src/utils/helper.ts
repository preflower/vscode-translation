const vscode = require('vscode');
const defaultLanguage = vscode.workspace.getConfiguration().get('easy-translator.defaultLanguage')
const covertedLanguage = vscode.workspace.getConfiguration().get('easy-translator.covertedLanguage')
const dictionary = vscode.workspace.getConfiguration().get('easy-translator.dictionary');

export interface Languages {
  [propName: string]: string | RegExp
}

const defaultLanguages: Languages = {
  'zh-cn': 'chinese',
  'en': 'english',
}

const languages: Languages = {
  'zh-cn': new RegExp('[\u4E00-\u9FA5]+'),
  'fr': new RegExp('[àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ]+'),
  'en': new RegExp('[A-Za-z]+"'),
  'jap': new RegExp('[\u0800-\u4E00]+'),
  'ko': new RegExp('[\uAC00-\uD7A3]+'),
}

export function checkLanguage(text: string) {
  for (let language in languages) {
    if(text.match(languages[language])) {
      return language;
    }
  }
  return 'en';
}

// 区分中/英文母语
export const isDefaultEnglish = defaultLanguages[defaultLanguage] === 'english'

// 判断传入的语言是否是母语，若是则将其转换成 CovertedLanguage
export function handlerDefaultLanguage(text: string) {
  const language = checkLanguage(text);
  if (language === defaultLanguage) return covertedLanguage;
  return language;
}

// 判断传入的语言是否是母语，若是则将其转换成 CovertedLanguage; 若不是则返回母语
export function handlerNeedCovertedLanguage(text: string) {
  const language = checkLanguage(text);
  if (language === defaultLanguage) return covertedLanguage;
  return defaultLanguage;
}

// 判断语言是否在词典中
export function isInDictionary(name: string) {
  return ~dictionary.indexOf(name) ? true : false;
}