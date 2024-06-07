const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on: any, config: any) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});