module.exports = {
  launch: {
    args: ['--incognito', '--ignore-certificate-errors'],
    // headless: false,
    // slowMo: 3000,
  },
  server: {
    command: 'npm run build:e2e & npm run start:e2e'
  }
};
