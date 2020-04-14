const vscode = require('vscode');
const defaultLanguage = vscode.workspace.getConfiguration().get('easy-translator.defaultLanguage')

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