describe('Organizations Page - With Login (Mocked)', () => {
    beforeEach(() => {
      // Intercept login API and simulate success
      cy.intercept('POST', 'http://localhost:8080/login', {
        statusCode: 200,
        body: {
          user_id: 99,
          user_name: 'skarneed',
          user_email: 'skarneed@ufl.edu',
          user_role: 'member',
          user_created_at: Date.now() / 1000
        }
      }).as('loginRequest');
  
      // Intercept /clubs data
      cy.intercept('GET', 'http://localhost:8080/clubs', {
        statusCode: 200,
        body: [
          {
            club_id: 1,
            club_name: 'AI Explorers',
            club_description: 'A club for students interested in AI.',
            club_category: 'STEM & Innovation'
          },
          {
            club_id: 2,
            club_name: 'Pre-Law Society',
            club_description: 'For future lawyers and LSAT prep.',
            club_category: 'Professional & Career'
          }
        ]
      }).as('getClubs');
  
      // Visit and log in
      cy.visit('/login');
      cy.get('input[name="username"]').type('skarneed@ufl.edu');
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginRequest');
      cy.url().should('not.include', '/login');
  
      // Go to organizations page
      cy.visit('/organizations');
      cy.wait('@getClubs');
    });
  
    it('should display organization cards after login', () => {
      cy.get('.organization-card', { timeout: 8000 }).should('have.length.at.least', 1);
    });
  
    it('should allow searching for a club', () => {
      cy.get('input[placeholder*="Search"]').type('AI');
      cy.get('.organization-card').should('contain.text', 'AI Explorers');
    });
  
    it('should allow category filtering', () => {
      cy.contains('STEM & Innovation').click();
      cy.get('.organization-card').should('contain.text', 'AI Explorers');
      cy.get('.organization-card').should('not.contain.text', 'Pre-Law Society');
    });
  });
  