import { faker } from '@faker-js/faker'

describe('Register and login then Create student then edit then delete it', () => {
   
  it('passes', () => {
    
    const url = Cypress.config('baseUrl');
    cy.log('url : ' + url)
        
    // fake datas
    const agentFirstName = faker.person.firstName()
    const agentLastName = faker.person.lastName()
    const agentLogin = faker.internet.email()
    const agentPassword = faker.internet.password()
    cy.log('fake agent : ' + agentFirstName + ', ' + agentLastName + ', ' + agentLogin + ', ' + agentPassword)

    const studentFirstName = faker.person.firstName()
    const studentLastName = faker.person.lastName()
    const studentEmail = faker.internet.email()
    const studentBirthdate = faker.date.past()
    const formattedDate = studentBirthdate.toISOString().split('T')[0]    
    cy.log('fake student : ' + studentFirstName + ', ' + studentLastName + ', ' + studentEmail + ', ' + formattedDate)

    // create agent
    cy.visit('/register')
    cy.get('[data-cy="register-input-firstname"]').type(agentFirstName)
    cy.get('[data-cy="register-input-lastname"]').type(agentLastName)
    cy.get('[data-cy="register-input-login"]').type(agentLogin)
    cy.get('[data-cy="register-input-password"]').type(agentPassword)
    cy.get('[data-cy="register-button-submit"]').click()

    // assert correctly redirected to login page
    cy.url().should('eq', `${url}/login`)

    // login
    cy.get('[data-cy="login-input-login"]').type(agentLogin)
    cy.get('[data-cy="login-input-password"]').type(agentPassword)
    cy.get('[data-cy="login-button-submit"]').click()
    
    // assert correctly redirected to home page
    cy.url().should('eq', `${url}/`)

    // create student
    cy.get('[data-cy="home-link-students"]').click()
    cy.get('[data-cy="studentslist-link-create"]').click()

    cy.get('[data-cy="studentform-input-firstname"]').type(studentFirstName)
    cy.get('[data-cy="studentform-input-lastname"]').type(studentLastName)
    cy.get('[data-cy="studentform-input-email"]').type(studentEmail)
    cy.get('[data-cy="studentform-input-birthdate"]').type(formattedDate)
    cy.get('[data-cy="studentform-button-submit"]').click()    
    
    // assert created
    cy.get('[data-cy="studentform-div-alert"]').should('contain.text', 'Student created successfully')

    // Return to students list
    cy.get('[data-cy="studentform-button-cancel"]').click()
    cy.url().should('eq', `${url}/students`)

    // Get the new student in the list, then click on edit
    cy.get('[data-cy="studentlist-ul-students"] > li')
      .contains(studentEmail)
      .parent()
      .find('[data-cy="studentlist-a-edit"]')
      .click()

    // Wait form and assert inputs are ok
    cy.get('[data-cy="studentform-input-firstname"]').should('have.value', studentFirstName)
    cy.get('[data-cy="studentform-input-lastname"]').should('have.value', studentLastName)
    cy.get('[data-cy="studentform-input-email"]').should('have.value', studentEmail)
    cy.get('[data-cy="studentform-input-birthdate"]').should('have.value', formattedDate)

    // Replace firstname and lastname with new values
    const studentFirstNameToUpdate = faker.person.firstName()
    const studentLastNameToUpdate = faker.person.lastName()
    cy.get('[data-cy="studentform-input-firstname"]').type(studentFirstNameToUpdate)
    cy.get('[data-cy="studentform-input-lastname"]').type(studentLastNameToUpdate)
    cy.get('[data-cy="studentform-button-submit"]').click()    

    // assert
    cy.get('[data-cy="studentform-div-alert"]').should('contain.text', 'Student updated successfully')
    
    // Return to students list
    cy.get('[data-cy="studentform-button-cancel"]').click()
    cy.url().should('eq', `${url}/students`)

    // Get the student updated in the list, then click on delete
    cy.get('[data-cy="studentlist-ul-students"] > li')
      .contains(studentFirstNameToUpdate)
      .parent()
      .find('[data-cy="studentlist-a-delete"]')
      .click()
      
    // assert
    cy.get('[data-cy="studentlist-div-alert"]').should('contain.text', 'Student deleted successfully')
  })
})