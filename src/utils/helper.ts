const vscode = require('vscode');
const defaultLanguage = vscode.workspace.getConfiguration().get('easy-translator.defaultLanguage')
const languages = {
  'zh-cn': new RegExp('[\u4E00-\u9FA5]+'),
  'en': new RegExp('[A-Za-z]+"')
} as {
  [key: string]: RegExp
}

export function checkLanguage(text: string) {
  const reg = languages[defaultLanguage];
  if (!reg || !text.match(reg)) return defaultLanguage;
  
  if (defaultLanguage === 'zh-cn') return 'en';
  else return 'zh-cn';
}