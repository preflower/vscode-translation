const vscode = require('vscode');
const got = require("got");
const cheerio = require("cheerio");
const language = vscode.workspace.getConfiguration().get('easy-translation.defaultLanguage')

let $: any;

function translate(text: string) {
  // 编码
  let keywords = encodeURIComponent(text),
    // fixed: 有道传递错误参数不会直接机器翻译bug
    to = language === 'zh-cn' ? '' : `/${language}`;

  return got.get(`http://www.youdao.com/w${to}/${keywords}`).then((res: any) => {
    const body = parser(res.body);
    let translate: string = '';
    if (body.isWord) {
      translate += `${body.phonetics.join('&nbsp;&nbsp;&nbsp;&nbsp;')}\n\n`;
      translate += body.translates.reduce((pre: string, cur: Array<any>) => {
        pre += `**${cur[0]}**  ${cur[1]}\n\n`;
        return pre;
      }, '')
    } else {
      translate += body.translates.join('\n\n');
    }
    
    return translate;
  });
}

export default async function youdao(pendingText: string) {
  let pre = `**[有道词典](http://www.youdao.com/w/${language}/${escape(pendingText)})**\n\n`;
  let text = await translate(pendingText);
  return pre + text;
}

interface Translate {
  phonetics: Array<string>,
  isWord: Boolean,
  translates: Array<any>
}

// 解析 HTML
function parser(html: string) {
  $ = cheerio.load(html, {
    decodeEntities: false,
  });

  const $containor = $("#phrsListTab");
  const $suggestContainor = $("#results-contents");
  const output: Translate = {
    phonetics: [],
    isWord: false,
    translates: []
  };
  /**
   * containor 为空，可能是：
   *    1.中英混合单词
   *    2.错误页
   */
  if (
    (!$containor || !$containor.length) &&
    (!$suggestContainor || !$suggestContainor.length)
  ) {
    return output;
  }

  output.phonetics = _parsePhonetics($containor);

  // 翻译
  const $webContainor = $("#webTrans");
  const $mechineContainor = $('#ydTrans');
  const normalTrans = _parseNormalTrans($containor);
  
  if (!normalTrans.trans.length) {
    const webTrans = _parseWebTrans($webContainor);
    if (!webTrans.length) webTrans.push(_parseMachineTrans($mechineContainor));
    normalTrans.trans.push(...webTrans)
  }

  output.isWord = normalTrans.isWord;
  output.translates = normalTrans.trans;

  return output;
}

// 提取音标
function _parsePhonetics($containor: any) {
  const phonetics: string[] = [];

  $containor.find(".pronounce").each((index: number, item: any) => {
    const content = removeTagsAndSpaces($(item).html());

    if (!content) {
      return;
    }

    phonetics.push(content);
  });

  return phonetics;
}

// 提取常规翻译
function _parseNormalTrans($containor: any) {
  const result = {
    isWord: false,
    trans: [] as any,
  };

  $containor.find("li").each((index: number, item: any) => {
    const text = $(item).text();
    let tran: string[] | string;

    // 判断开头有没有词语类型, 由此判断传来的是句子还是单词 eg: n vt vi
    if (/^[a-z]+\./i.test(text)) {
      const array = $(item).text().split(". ");
      result.isWord = true;
      tran = array;
    } else {
      tran = text;
    }

    result.trans.push(tran);
  });

  /**
   * 可能是中文
   */
  if (!result.trans.length) {
    const trans: string[] = [];
    $containor.find(".contentTitle a").each((index: number, item: any) => {
      const html = $(item).html();
      const tran = removeTagsAndSpaces(html);
      trans.push(tran);
    });
    if (trans.length) result.trans.push(trans.join("; "));
  }

  return result;
}

// 提取网络翻译
function _parseWebTrans($containor: any) {
  const trans: string[] = [];

  // 网络释义
  $containor.find(".wt-container .title > span").each((index: number, item: any) => {
    const text = removeTagsAndSpaces($(item).text());
    trans.push(text);
  });

  return trans;
}

// 提取机器翻译
function _parseMachineTrans($container: any) {
  return removeTagsAndSpaces($container.find('.trans-container > p:nth-child(2)').text());
}

// 移除 HTML 文本中的标签，合并多个空白为单个
function removeTagsAndSpaces(html: string) {
  if (!html || typeof html !== "string") {
    return html;
  }

  return html
    .replace(/<[^>]+?>/gm, "") // 移除 html 标签
    .replace(/\s+/gm, " ") // 合并空格
    .trim();
}