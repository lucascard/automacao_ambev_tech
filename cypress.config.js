const { defineConfig } = require('cypress');
const path = require('path');

module.exports = defineConfig({
  projectId: 'mkmnn6',
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 'cypress/api/**/**/*.cy.{js,jsx,ts,tsx}'],
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      const specFile = config.spec;
      const isApiTest = specFile && specFile.includes(`${path.sep}api${path.sep}`);

      config.baseUrl = isApiTest ? config.env.apiBaseUrl : config.env.e2eBaseUrl;

      return config;
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  env: {
    // Configurações para API
    apiBaseUrl: 'https://serverest.dev',
    swaggerUrl: 'https://serverest.dev/swagger.json',

    // Configurações para E2E
    e2eBaseUrl: 'https://front.serverest.dev',
  },
});
