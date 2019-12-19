module.exports = {
  exclude: ['src/components/*.ts', 'src/util/*.ts'],
  excludeExternals: true,
  excludeNotExported: false,
  excludePrivate: true,
  excludeProtected: false,
  hideGenerator: true,
  includeDeclarations: false,
  ignoreCompilerErrors: true,
  name: 'ForgeRock JavaScript SDK with UI',
  out: './docs',
  readme: 'none',
  theme: 'default',

  // mode didn't work here, so it's specified in package.json instead
  // mode: 'file',
};
