// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import youdao from './translate/youdao';
import google from './translate/google';

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vsc-google-translate" is now active!'
  );

  const disposable = vscode.languages.registerHoverProvider(
    { scheme: "file" },
    {
      provideHover: async (document, position, token) => {
        let editor = vscode.window.activeTextEditor as any,
          selectionText = editor.document.getText(editor.selection),
          resultText = '';
        if (selectionText) {
          let youdaoResult = await youdao(selectionText);
          let googleResult = await google(selectionText);
          resultText = `${googleResult} \n\n ${youdaoResult}`;
        }
        return new vscode.Hover(resultText);
      },
    }
  );
  context.subscriptions.push(disposable);
}
