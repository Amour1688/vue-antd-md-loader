const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: "./src/entry.js",
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "build.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.md$/,
        use: ['vue-loader', {
          loader: path.resolve(__dirname, "../index.js"),
          options: {
            raw: false,
            transformer: ({ meta, code, strip, id, highlightCode }) => {
              const { template, script, style } = strip(code);
              const jsfiddle = {
                ...meta,
                id,
                sourceCode: code
              };
              return `
                <template>
                  <demo-box :jsfiddle='${JSON.stringify(jsfiddle)}'>
                    <template slot="component">${template}</template>
                    <template slot="description">${id}</template>
                    <template slot="us-description">${id}</template>
                    <template slot="code">${Buffer.from(highlightCode.html).toString('base64')}</template>
                  </demo-box>
                </template>
                <script>
                  ${script}
                </script>
                <style>
                 ${style}
                </style>
              `;
            },
          }
        }],
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    // open: true,
    // noInfo: true
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
};
