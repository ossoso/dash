/// <reference types="Cypress" />
let process = require('process')

context('Waiting', () => {
  beforeEach(() => {
    cy.visit('localhost:8050')
  })
    it('simple callback', () => {
      // not supported by current release
      console.error("should output to stderr of headless run");
      
      cy.wait_for_text_to_equal("#output-1", "initial value", 0)
      cy.percySnapshot(name="simple-callback-1")

      cy.get('#input').clear().type("hello world")

      cy.wait_for_text_to_equal("#output-1", "hello world", 10000)
      cy.percySnapshot(name="simple-callback-2")
  })
})
