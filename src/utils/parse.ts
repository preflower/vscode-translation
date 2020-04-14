const cheerio = require("cheerio");

interface Translate {
  phonetics: Array<string>;
  translates: Array<string>;
}

export class Parse {
  $: any;
  $container: any;
  output: Translate = {
    phonetics: [],
    translates: [],
  };

  constructor(html: string, container: string) {
    this.$ = cheerio.load(html, {
      decodeEntities: false,
    });
    this.$container = this.$(container);
  }

  // 提取音标
  _parsePhonetics($item: string) {
    const phonetics: string[] = [];

    this.$container.find($item).each((index: number, item: any) => {
      const content = Parse.removeTagsAndSpaces(this.$(item).html());
      if (!content) return;
      phonetics.push(content);
    });

    this.output.phonetics = phonetics;
  }

  // 提取机器翻译
  _parseMachineTrans($item: string) {
    const text = Parse.removeTagsAndSpaces(this.$container.find($item).text());
    console.log(text);
    if (text) {
      const tran = `_机器翻译_ \n\n ${text}`;
      this.output.translates.push(tran);
    }
  }

  // 移除 HTML 文本中的标签，合并多个空白为单个
  static removeTagsAndSpaces(html: string) {
    if (!html || typeof html !== "string") {
      return html;
    }

    return html
      .replace(/<[^>]+?>/gm, "") // 移除 html 标签
      .replace(/\s+/gm, " ") // 合并空格
      .trim();
  }
}

export function Output2String(output: Translate) {
  let translate = '';
  const { phonetics, translates } = output;
  if (phonetics) {
    translate += `${phonetics.join('&nbsp;&nbsp;&nbsp;&nbsp;')}\n\n`;
  }
  translate += translates.join('\n\n');
  return translate;
}