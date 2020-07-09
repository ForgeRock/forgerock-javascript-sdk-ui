const { exec } = require('child_process');
const path = require('path');

module.exports = (env) => {
  const isDev = env.DEV === 'yes';

  const plugins = [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          const cmds = [
            'cpy ./bundles/fr-ui.css ./samples/_static/css',
            'cpy ./bundles/fr-ui.css ./tests/e2e/app/_static/css',
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
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: ['node_modules/@forgerock/ui-design/src/scss'],
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
      path: path.resolve('./bundles'),
    },
    plugins,
    watch: isDev,
  };
};
