// const translate = require('translation-google');

// translate.suffix = 'cn';

// translate("Ik spreek Engels", { to: "en" })
//   .then((res) => {
//     console.log(res.text);
//     //=> I speak English
//     console.log(res.from.language.iso);
//     //=> nl
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const got = require("got");
const cheerio = require("cheerio");

// 编码
let keywords = encodeURIComponent(`see`);

got.get(`http://www.youdao.com/w/eng/${keywords}`).then((res) => {
  console.log(parser(res.body));
});

// 解析 HTML
function parser(html) {
  $ = cheerio.load(html, {
    decodeEntities: false,
  });

  const $containor = $("#phrsListTab");
  const $suggestContainor = $("#results-contents");
  const output = {};
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
  const normalTrans = _parseNormalTrans($containor);
  
  if (!normalTrans.trans.length) {
    const webTrans = _parseWebTrans($webContainor);
    normalTrans.trans.concat(webTrans)
  }

  output.isWord = normalTrans.isWord;
  output.translates = normalTrans.trans;

  return output;
}

// 提取音标
function _parsePhonetics($containor) {
  const phonetics = [];

  $containor.find(".pronounce").each((index, item) => {
    const html = $(item).html();
    const content = removeTagsAndSpaces($(item).html());

    if (!content) {
      return;
    }

    phonetics.push(content);
  });

  return phonetics;
}

// 提取常规翻译
function _parseNormalTrans($containor) {
  const result = {
    isWord: false,
    trans: [],
  };

  $containor.find("li").each((index, item) => {
    const text = $(item).text();
    let tran;

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
    let trans = [];
    $containor.find(".contentTitle a").each((index, item) => {
      const html = $(item).html();
      const tran = removeTagsAndSpaces(html);
      trans.push(tran);
    });
    if (trans.length) result.trans.push(trans.join("; "));
  }

  return result;
}

// 提取网络翻译
function _parseWebTrans($containor) {
  const trans = [];

  // 网络释义
  $containor.find(".wt-container .title > span").each((index, item) => {
    const text = removeTagsAndSpaces($(item).text());
    trans.push(text);
  });

  // 有网络释义的话，结束解析，否则进一步提取短语
  if (trans.length) {
    return trans;
  }

  $containor.find("#webPhrase .wordGroup").each((index, item) => {
    const text = removeTagsAndSpaces($(item).html());
    const result = new Translate("网络释义", text);

    trans.push(result);
  });

  return trans;
}

// 移除 HTML 文本中的标签，合并多个空白为单个
function removeTagsAndSpaces(html) {
  if (!html || typeof html !== "string") {
    return html;
  }

  return html
    .replace(/<[^>]+?>/gm, "") // 移除 html 标签
    .replace(/\s+/gm, " ") // 合并空格
    .trim();
}
