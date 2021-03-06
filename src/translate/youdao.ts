import { Parse, Output2String } from "../utils/parse";
import {
  Languages,
  handlerNeedCovertedLanguage,
  isInDictionary,
} from "../utils/helper";
const got = require("got");

const languages: Languages = {
  "zh-cn": "",
};

function translate(text: string) {
  // 编码
  let keywords = encodeURIComponent(text),
    language = handlerNeedCovertedLanguage(text),
    // fixed: 有道传递错误参数不会直接机器翻译bug
    to = languages[language] || `/${language}`;
  return got
    .get(`http://www.youdao.com/w${to}/${keywords}`)
    .then((res: any) => {
      const parser = new Parse(res.body, "#results-contents");
      const normalTrans = parseNormalTrans(parser);
      parser._parsePhonetics(".pronounce");

      parser.output.translates.push(...normalTrans);
      parser._parseMachineTrans(
        "#fanyiToggle .trans-container > p:nth-child(2)"
      );
      return Output2String(parser.output);
    })
    .catch(() => {
      return;
    });
}

export default async function youdao(pendingText: string) {
  if (!isInDictionary("YouDao")) return;
  let language = handlerNeedCovertedLanguage(pendingText),
    // fixed: 有道传递错误参数不会直接机器翻译bug
    to = languages[language] || `/${language}`;
  let pre = `**[有道词典](http://www.youdao.com/w${to}/${escape(
    pendingText
  )})**\n\n`;
  let text = await translate(pendingText);
  if (text) return pre + text;
  return;
}

// 提取常规翻译
function parseNormalTrans(parser: Parse) {
  const { $, $container } = parser;
  const trans: Array<string> = [];

  $container.find("#phrsListTab li").each((index: number, item: any) => {
    const text = $(item).text();
    let tran: string;

    // 判断开头有没有词语类型, 由此判断传来的是句子还是单词 eg: n vt vi
    if (/^[a-z]+\./i.test(text)) {
      const arr = $(item).text().split(". ");
      tran = `**${arr[0]}** &nbsp;&nbsp; ${arr[1]}`;
    } else {
      tran = Parse.removeTagsAndSpaces(text);
    }
    trans.push(tran);
  });
  
  /**
   * 可能是中文
   */
  if (!trans.length) {
    const result: string[] = [];
    $container
      .find("#phrsListTab .wordGroup")
      .each((index: number, item: any) => {
        const text = Parse.removeTagsAndSpaces($(item).text());
        let tran: string;
        // 判断开头有没有词语类型, 由此判断传来的是句子还是单词 eg: n vt vi
        if (/^[a-z]+\./i.test(text)) {
          const arr = text.split(".");
          tran = `**${arr[0]}** &nbsp;&nbsp; ${arr[1]}`;
          trans.push(tran);
        } else {
          tran = text;
          result.push(tran);
        }
      });
    if(result.length) trans.push(result.join("; "));
  }
  
  // 提取汉日翻译
  if (!trans.length) {
    $container
      .find('li .sense-title')
      .each((index: number, item: any) => {
        const text = Parse.removeTagsAndSpaces($(item).text());
        trans.push(text)
      });
  }

  return trans;
}
