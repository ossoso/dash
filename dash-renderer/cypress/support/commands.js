// def _wait_for(self, method, args, timeout, msg):
//     """Abstract generic pattern for explicit WebDriverWait."""
//     _wait = (
//         self._wd_wait
//         if timeout is None
//         else WebDriverWait(self.driver, timeout)
//     )
//     logger.debug(
//         "method, timeout, poll => %s %s %s",
//         method,
//         _wait._timeout,  # pylint: disable=protected-access
//         _wait._poll,  # pylint: disable=protected-access
//     )

// logging handled in ../support/index.js
// const _wait_for = (method, args, timeout, msg) => {

// }
/// <reference types="Cypress" />
import 'cypress-wait-until';

const textContentHelper = ($el) => ($el.text() || $el.attr('value'))

Cypress.Commands.add('wait_for_text_to_equal', (selector, text, timeout = null) => {
    // cy.waitUntil(() => true)
	cy.waitUntil(
			// () => cy.get(selector).then(($textEl) => textContentHelper($textEl)),
            () => {
                    return (
                        cy.get(selector).then(($el) => (
                            ($el.text() === text) && $el.text()
                            || ($el.attr('value') === text) && $el.attr('value')
                        )
                        )
                    )
            },
			{
				errorMsg: 'expected condition not met within timeout',
                interval: 100,
                timeout
			}
		)
        .should((elText) => {
            expect(elText).to.eq(text)
        })
})
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
