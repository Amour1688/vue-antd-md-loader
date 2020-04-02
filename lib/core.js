const YFM = require('yaml-front-matter');
const loaderUtils = require("loader-utils");
const path = require('path');
const remark = require('remark')();
const JsonML = require('jsonml.js/lib/utils');
const tsf = require('./transformer');
const { 
  getHighlightCodes
} = require('./highlight');
const { previewComponent, strip } = require('./preview');

function getCode(node) {
  return JsonML.getChildren(
    JsonML.getChildren(node)[0],
  )[0];
}

function getCodeIndex(contentChildren) {
  return contentChildren.findIndex((node) => JsonML.getTagName(node) === 'pre'
  && ['vue', 'tpl', 'jsx'].includes(JsonML.getAttributes(node).lang));
}

module.exports = function(source) {
  if (this.cacheable) {
    this.cacheable();
  }
  const markdown = {};
  const fullPath = this.resourcePath;
  const filename = path.relative(process.cwd(), fullPath);
  const { __content: content, ...meta } = YFM.loadFront(source) || {};
  Object.assign(markdown, {
    meta,
    id: filename.replace(/\.md$/, '').replace(/\//g, '-'),
    filename,
    content: tsf(remark.parse(content)),
  });

  const contentChildren = JsonML.getChildren(markdown.content);
  const codeIndex = getCodeIndex(contentChildren);
  const code = getCode(contentChildren[codeIndex]);
  const { template, script, style } = strip(code);

  Object.assign(markdown, {
    code,
    highlightCode: getHighlightCodes({ code, lang: JsonML.getAttributes(contentChildren[codeIndex]).lang}),
    strip,
    previewComponent
  });

  const options = loaderUtils.getOptions(this);

  const { raw, transformer } = options;

  if (raw) {
    const vue = `
      <template>
        <abc />
      </template>
      <script>
      export default {
        components: {
          abc: ${previewComponent({ template, script })}
        }
      }
      </script>
    `;

    if (style) {
      return `
        ${vue}
        <style>
          ${style}
        </style>
      `
    };

    return vue;
  }

  if (transformer) {
    return transformer(markdown);
  }

  return markdown;
};
