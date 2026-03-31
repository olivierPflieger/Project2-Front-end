import { faker } from '@faker-js/faker'

describe('Register and Login tests', () => {
   
  it('Register new agent then login then logout', () => {
    
    const url = Cypress.config('baseUrl');
    cy.log('url : ' + url)

    // fake datas
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const login = faker.internet.email()
    const password = faker.internet.password()
    cy.log('fake agent : ' + firstName + ', ' + lastName + ', ' + login + ', ' + password)

    // register new agent
    cy.visit('/register')
    cy.get('[data-cy="register-input-firstname"]').type(firstName)
    cy.get('[data-cy="register-input-lastname"]').type(lastName)
    cy.get('[data-cy="register-input-login"]').type(login)
    cy.get('[data-cy="register-input-password"]').type(password)
    cy.get('[data-cy="register-button-submit"]').click()

    // assert correctly redirected to login page
    cy.url().should('eq', `${url}/login`)

    // login
    cy.get('[data-cy="login-input-login"]').type(login)
    cy.get('[data-cy="login-input-password"]').type(password)
    cy.get('[data-cy="login-button-submit"]').click()
    
    // assert correctly redirected to home page
    cy.url().should('eq', `${url}/`)

    // logout
    cy.get('[data-cy="home-button-logout"]').click()

    // assert
    cy.get('[data-cy="home-link-login"]').should('have.attr', 'href', '/login')
  })
  
  it('Login unknown user should display an error', () => {
    
    const url = Cypress.config('baseUrl');
    cy.log('url : ' + url)

    // fake datas
    const login = faker.internet.email()
    const password = faker.internet.password()
    cy.log('fake user : ' + login + ', ' + password)
    
    cy.visit('/login')

    // login
    cy.get('[data-cy="login-input-login"]').type(login)
    cy.get('[data-cy="login-input-password"]').type(password)
    cy.get('[data-cy="login-button-submit"]').click()
    
    // assert
    cy.get('[data-cy="login-div-alert"]').should('contain.text', 'Login or password incorrect')
  }) 
  
})