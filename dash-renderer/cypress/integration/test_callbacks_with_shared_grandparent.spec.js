
/// <reference types="Cypress" />
let process = require('process')

context('callbacks with shared grandparent', () => {
  beforeEach(() => {
    cy.visit('localhost:8050')
  })
    it('simple callback', () => {
      // not supported by current release
      console.error("should output to stderr of headless run");
      cy.wait_for_element_by_css_selector("#session-id")
      cy.wait(2000)
      cy.get('#input').clear().type("hello world")
      cy.wait_for_text_to_equal("#output-1", "hello world")
      cy.percy_snapshot(name="simple-callback-2")
  })
})
