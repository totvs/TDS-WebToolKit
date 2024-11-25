// @ts-nocheck
"use strict";
const path = require("path");
//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const TerserPlugin = require("terser-webpack-plugin");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
//const plugins: any[] = []; //new MiniCssExtractPlugin()

const BUILD_FOLDER = path.resolve(path.join(
  __dirname,
  "dist"
));

const SOURCE_FOLDER = path.resolve(path.join(
  __dirname,
  "src"
));

const WEBTOOLKIT_PATH = path.join(SOURCE_FOLDER, "");

module.exports = (env, argv) => {
  const production = (argv.mode === 'production') || (env.NODE_ENV === 'production');
  const devtool = production ? false : 'inline-source-map';

  const splitChunks = !production ? {} : {
    //chunks: 'sync',
    // minSize: 20000,
    // minRemainingSize: 0,
    // minChunks: 1,
    // maxAsyncRequests: 30,
    // maxInitialRequests: 30,
    // enforceSizeThreshold: 50000,
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  };

  const optimization = !production ? {
    splitChunks: splitChunks
  } : {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: splitChunks
  }

  /** @type WebpackConfig */
  const webviewConfig = {
    target: "node",
    devtool: devtool,
    optimization: optimization,
    plugins: [],
    //O webpack, pega todos os fontes tsx e os compacta em um único arquivo .js. Isso é feito para contornar algumas limitações e alguns browsers que não aceitam a instrução import.
    //O entry pode ser definido com um objeto. A chave, ou no nome da propriedade, nesse caso sera o nome de saída do arquivo.
    entry: {
      index: path.join(WEBTOOLKIT_PATH, "index.ts"),
    },
    output: {
      //Todos os arquivos tsx serão compilados e gerados seus equivalentes js na mesma pasta
      path: path.resolve(BUILD_FOLDER),
      //O [name] abaixo é o que foi definido no "entry" acima, ou seja, o arquivo gerado tera o nome do 'entry'
      filename: "[name].js",
    },
    externals: {
      // the vscode-module is created on-the-fly and must be excluded.
      //Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
      vscode: "commonjs vscode",
    },
    resolve: {
      alias: {
        react: path.resolve('./node_modules/react'),
        // "@vscode-elements": path.resolve('./node_modules/@vscode-elements'),
      },
      extensions: [
        ".js",
        ".ts",
        ".tsx",
        ".json",
        ".bundle.json",
        ".bundle.*.json"
      ]
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              // options: {
              // },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    performance: {
      hints: "warning",
    }
  };


  return [webviewConfig]
};
