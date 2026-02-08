/// <reference types="cypress" />

Cypress.Commands.add('login', () => {
    cy.session('skarneed@ufl.edu', () => {
      cy.visit('http://localhost:4200/login');
  
      cy.get('input[name="username"]').type('skarneedi@ufl.edu');
      cy.get('input[name="password"]').type('123');
  
      cy.get('button[type="submit"]').click();
  
      // Optional debug
      cy.get('body').then($body => {
        if ($body.text().includes('Invalid email') || $body.text().includes('Incorrect password')) {
          throw new Error('🚫 Login failed');
        }
      });
  
      cy.url().should('not.include', '/login');
    });
  });
  
  declare global {
    namespace Cypress {
      interface Chainable {
        login(): Chainable<void>;
      }
    }
  }
  export {};
  