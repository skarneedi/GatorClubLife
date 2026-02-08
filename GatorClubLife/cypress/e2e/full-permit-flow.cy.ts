describe('Permits Page - Smoke Check', () => {
    it('should load and dump visible page text', () => {
      cy.visit('http://localhost:4200/permits', {
        onBeforeLoad(win) {
          win.localStorage.setItem('user', JSON.stringify({
            user_email: 'test@ufl.edu',
            user_name: 'Test User',
            user_role: 'member',
            user_created_at: 1713493956
          }));
        }
      });
  
      // Wait a bit to let the page load
      cy.wait(1000);
  
      // Screenshot what Cypress sees
      cy.screenshot('permits-visible-content');
  
      // Log visible text to confirm page content
      cy.get('body').then(($body) => {
        const visibleText = $body.text();
        cy.log('Page text:', visibleText);
      });
  
      
    });
  });
  