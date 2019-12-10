const { exec } = require('child_process');
const path = require('path');
const webpack = require('webpack');
const TSLintPlugin = require('tslint-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = (env) => {
  const isDev = env.DEV === 'yes';

  const plugins = [
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/, /bundles|docs|lib|lib\-esm|samples/]),
    new TSLintPlugin({
      files: ['./src/**/*.ts'],
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          const cmds = [
            'cpy ./bundles/index.js ./samples/js --rename=fr-sdk-ui.js',
          ];
          for (var cmd of cmds) {
            exec(cmd, (err, stdout, stderr) => {
              if (err) {
                console.error(err);
                return;
              }

              if (stdout) process.stdout.write(stdout);
              if (stderr) process.stderr.write(stderr);
            });
          }
        });
      }
    }
  ];

  if (!isDev) {
    plugins.push(
      new TypedocWebpackPlugin({
        excludeExternals: true,
        excludePrivate: true,
        includeDeclarations: false,
        ignoreCompilerErrors: true,
        mode: 'modules',
        name: 'ForgeRock JavaScript SDK UI',
        out: '../docs',
      }, './src'));
  }

  return {
    devtool: isDev ? 'eval-source-map' : 'source-map',
    entry: './src/index.ts',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          exclude: /node_modules/,
          query: {
            declaration: false
          }
        },
        {
          test: /\.html$/,
          use: 'raw-loader',
        },
      ],
    },
    optimization: {
      minimize: !isDev,
    },
    output: {
      filename: 'index.js',
      library: ['forgerock'],
      libraryTarget: 'umd',
      path: path.resolve('./bundles'),
      umdNamedDefine: true,
    },
    plugins,
    resolve: {
      extensions: ['.js', '.ts'],
    },
    watch: isDev,
  };
}
