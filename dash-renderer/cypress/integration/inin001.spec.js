/// <reference types="Cypress" />

context('Waiting', () => {
  beforeEach(() => {
    cy.visit('localhost:8050')
  })
  // BE CAREFUL of adding unnecessary wait times.
  // https://on.cypress.io/best-practices#Unnecessary-Waiting

  // https://on.cypress.io/wait
  it('cy.wait() - wait for a specific amount of time', () => {
    cy.get('.wait-input1').type('Wait 1000ms after typing')
    cy.wait(1000)
    cy.get('.wait-input2').type('Wait 1000ms after typing')
    cy.wait(1000)
    cy.get('.wait-input3').type('Wait 1000ms after typing')
    cy.wait(1000)
  })

  it('cy.wait() - wait for a specific route', () => {
    cy.server()

    // Listen to GET to comments/1
    cy.route('GET', 'comments/*').as('getComment')

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get('.network-btn').click()

    // wait for GET comments/1
    cy.wait('@getComment').its('status').should('eq', 200)
  })

    it.only('simple callback', () => {

      cy.wait_for_text_to_equal("#output-1", "initial value", 10000)
  })
  it('simple wait error', () => {
      
  })

})
