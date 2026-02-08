import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    
     // Replace with your Angular app's URL
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}', // Define where test files are located
    setupNodeEvents(on, config) {
      // Implement custom logic here if needed (e.g., plugins or utilities)
    },
  },
});