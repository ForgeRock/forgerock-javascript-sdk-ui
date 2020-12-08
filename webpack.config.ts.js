const { exec } = require('child_process');
const path = require('path');
const webpack = require('webpack');

const banner = `
@forgerock/javascript-sdk

index.js

Copyright (c) ${new Date().getFullYear()} ForgeRock. All rights reserved.
This software may be modified and distributed under the terms
of the MIT license. See the LICENSE file for details.
`;

module.exports = (env) => {
  const isDev = env.DEV === 'yes';

  const plugins = [
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/, /bundles|docs|lib|lib\-esm|samples/]),
    new webpack.BannerPlugin(banner),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          const cmds = [
            'copyup ./bundles/index.js* ./samples/_static/js',
            'copyup ./bundles/index.js* ./tests/e2e/site',
            'copyup ./bundles/index.js* ./tests/e2e/app/_static/js',
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
      },
    },
  ];

  return {
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          exclude: /node_modules/,
          query: {
            declaration: false,
          },
        },
        {
          test: /\.html$/,
          use: 'raw-loader',
        },
      ],
    },
    optimization: {
      minimize: false,
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
};
