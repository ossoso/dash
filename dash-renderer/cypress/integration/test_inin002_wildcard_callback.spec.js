/// <reference types="Cypress" />

context('wildcard callback', () => {
  beforeEach(() => {
    cy.visit('localhost:8050')
  })
    it('simple callback', () => {
      cy.wait_for_text_to_equal("#output-1", "initial value", 0)
      cy.percySnapshot(name="wildcard-callback-1")

      cy.get('#input').clear().type("hello world")

    // field content not checked this time
    //   cy.wait_for_text_to_equal("#output-1", "hello world")
      cy.percySnapshot(name="wildcard-callback-2")
  })
})