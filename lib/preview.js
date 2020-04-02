const { compileTemplate } = require('@vue/component-compiler-utils');
const compiler = require('vue-template-compiler');

function stripStyle(content) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function stripTemplate(content) {
  const result = content.match(/<(template)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
  // content = content.trim();
  // if (!content) {
  //   return content;
  // }
  // return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim();
}

function strip(content) {
  return {
    template: stripTemplate(content),
    script: stripScript(content),
    style: stripStyle(content)
  };
};

function previewComponent({ template, script, filename }) {
  // https://github.com/vuejs/vue-loader/blob/master/lib/loaders/templateLoader.js
  const finalOptions = {
    source: `<div>${template}</div>`,
    filename,
    compiler
  };

  const compiled = compileTemplate(finalOptions);

  if (script) {
    script = script.replace(/export\s+default/, '');
  }
  
  const { code } = compiled;
  return `(function() {
    ${code}
    return {
      render,
      staticRenderFns,
      ...${script || '{}'}
    }
  })()`;
};

module.exports = {
  previewComponent,
  stripStyle,
  stripScript,
  stripTemplate,
  strip
};
