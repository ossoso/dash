/// <reference types="Cypress" />

context('simple callback interaction', () => {
  beforeEach(() => {
    cy.visit('localhost:8050')
  })
    it('simple callback', () => {
      cy.wait_for_text_to_equal("#output-1", "initial value", 0)
      cy.percySnapshot(name="simple-callback-1")

      cy.get('#input').clear().type("hello world")

      cy.wait_for_text_to_equal("#output-1", "hello world")
      cy.percySnapshot(name="simple-callback-2")
  })
})
