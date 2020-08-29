// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import youdao from "./translate/youdao";
import google from "./translate/google";
import bing from "./translate/bing";
import linguee from "./translate/linguee";
import { isDefaultEnglish } from "./utils/helper";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vsc-google-translate" is now active!'
  );
  let lastData: number;
  const disposable = vscode.languages.registerHoverProvider(
    { scheme: "file" },
    {
      provideHover: async (document, position, token) => {
        const result = [];
        let editor = vscode.window.activeTextEditor as any,
          selectionText = editor.document.getText(editor.selection),
          resultText = "";
        if (!isInSelectedText(position, editor.selection)) return;
        // 为了解决谷歌翻译若访问频繁可能会 锁ip 问题
        const currentDate = +new Date();
        if (lastData && currentDate - lastData < 1000)
          return new vscode.Hover("");
        if (selectionText) {
          lastData = currentDate;
          let googleResult = await google(selectionText);
          if (isDefaultEnglish) {
            let lingueeResult = await linguee(selectionText);
            if (lingueeResult) result.push(lingueeResult);
          } else {
            let bingResult = await bing(selectionText);
            let youdaoResult = await youdao(selectionText);
            if (bingResult) result.push(bingResult);
            if (youdaoResult) result.push(youdaoResult);
          }
          if (googleResult) result.push(googleResult);
          resultText =
            result.join("\n\n") ||
            `暂无翻译，如果是产品问题请提[issue](https://github.com/preflower/vscode-translation/issues)`;
        }
        return new vscode.Hover(resultText);
      },
    }
  );
  context.subscriptions.push(disposable);
}

// 判断鼠标是否在选中区域
function isInSelectedText(position: any, selectedPosition: any) {
  const { line: startLine, character: startCharacter } = selectedPosition.start;
  const { line: endLine, character: endCharacter } = selectedPosition.end;
  const { line, character } = position;
  if (startLine < line && line < endLine) { return true;}
  else if (startLine === line && character >= startCharacter) { return true;}
  else if (line === endLine && character <= endCharacter) { return true;}
  return false; 
}