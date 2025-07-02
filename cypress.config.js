const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'mkmnn6',
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 'cypress/api/**/**/*.cy.{js,jsx,ts,tsx}'],
    supportFile: 'cypress/support/commands.js',
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    pageLoadTimeout: 60000,
  },
  env: {
    apiUrl: 'https://serverest.dev',
  },
});