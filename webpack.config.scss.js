const { exec } = require('child_process');
const path = require('path');

module.exports = (env) => {
  const isDev = env.DEV === 'yes';

  const plugins = [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          const cmds = [
            'copyfiles -u 1 "./bundles/fr-ui.css" ./samples/_static/css/',
            'copyfiles -u 1 "./bundles/fr-ui.css" ./tests/e2e/app/_static/css',
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
    entry: './src/css/sdk.scss',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fr-ui.css',
              },
            },
            {
              // Run postcss actions
              loader: 'postcss-loader',
              options: {
                // `postcssOptions` is needed for postcss 8.x;
                // if you use postcss 7.x skip the key
                postcssOptions: {
                  // postcss plugins, can be exported to postcss.config.js
                  plugins: [
                    [
                      'autoprefixer',
                      {
                        // Options
                      },
                    ],
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [],
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
    },
    output: {
      filename: 'main.js',
      path: path.resolve('./bundles'),
    },
    plugins,
    watch: isDev,
  };
};
