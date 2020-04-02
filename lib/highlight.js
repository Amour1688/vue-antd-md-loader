const Prism = require('prismjs');
require('prismjs/components/prism-jsx.min.js');
require('prismjs/components/prism-bash.min.js');
require('prismjs/components/prism-json.min.js');
require('prismjs/components/prism-diff.min.js');
require('prismjs/components/prism-less.min.js');

function getHighlightCodes({ code, lang }) {
  let codes = {};
  const lan = ['vue', 'tpl'].includes(lang) ? 'html' : lang;
  codes[lang] = Prism.highlight(code, Prism.languages[lan]);
  if (lan === 'tsx') {
    codes = {
      ...codes,
      ...getHighlightCodes({ code: parseText(code), lan: 'jsx' }),
    };
  }
  return codes;
}

function getSourceCodeObject(contentChildren, codeIndex) {
  if (codeIndex > -1) {
    return {
      isES6: true,
      code: getCode(contentChildren[codeIndex]),
      lang: JsonML.getAttributes(contentChildren[codeIndex]).lang,
    };
  }
}

module.exports = {
  getSourceCodeObject,
  getHighlightCodes
};
