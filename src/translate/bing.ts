import { Parse, Output2String } from "../utils/parse";
const got = require("got");

function translate(text: string) {
  return got
    .get(`https://cn.bing.com/dict/search?q=${text}`)
    .then((res: any) => {
      const parser = new Parse(res.body, ".lf_area");
      const normalTrans = parseNormalTrans(parser);

      parser._parsePhonetics(".hd_p1_1 > .b_primtxt");
      parser.output.translates.push(...normalTrans);
      parser._parseMachineTrans(".p1-11");

      return Output2String(parser.output);
    })
    .catch(() => {
      return;
    });
}

export default async function youdao(pendingText: string) {
  let pre = `**[必应词典](https://cn.bing.com/dict/search?q=${escape(pendingText)})**\n\n`;
  let text = await translate(pendingText);
  if (text) return pre + text;
  return;
}

// 获取常规翻译
function parseNormalTrans(parser: Parse) {
  const { $, $container } = parser;
  const trans: Array<string> = [];
  $container.find(".qdef li").each((index: number, item: any) => {
    const $li = $(item);
    const type = $li.find(".pos").text().replace(".", "");
    const tran = $li.find(".def").text();
    if (type && tran) trans.push(`**${type}** &nbsp;&nbsp; ${tran}`);
  });
  return trans;
}
