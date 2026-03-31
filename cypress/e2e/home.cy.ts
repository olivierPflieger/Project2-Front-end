describe('tests', () => {
   
  it('Navigate to home page', () => {
    
    cy.visit('/')
    
    // assert
    cy.get('[data-cy="home-link-register"]').should('contain.text', 'Register a new agent')    

  })
})