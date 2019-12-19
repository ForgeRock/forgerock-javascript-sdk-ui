module.exports = {
  launch: {
    args: ['--incognito'],
    // headless: false,
    // slowMo: 3000,
  },
  server: {
    command: 'npm run build:e2e & npm run server:e2e'
  }
};
