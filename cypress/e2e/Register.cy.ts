import { faker } from '@faker-js/faker'

describe('Register tests', () => {
   
  it('Register new agent should work', () => {
    
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
  }) 
  
  it('Register existing agent should display an error', () => {
    
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

    // register the same agent
    cy.visit('/register')
    cy.get('[data-cy="register-input-firstname"]').type(firstName)
    cy.get('[data-cy="register-input-lastname"]').type(lastName)
    cy.get('[data-cy="register-input-login"]').type(login)
    cy.get('[data-cy="register-input-password"]').type(password)
    cy.get('[data-cy="register-button-submit"]').click()

    // assert
    cy.get('[data-cy="register-div-alert"]').should('contain.text', `User with login ${login} already exists`)

  })
  
})