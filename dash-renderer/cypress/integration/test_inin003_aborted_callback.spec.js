/// <reference types="Cypress" />

context(`Raising PreventUpdate OR returning no_update prevents update and
    triggering dependencies.`, () => {
( Cypress.env('PHASE') == 1 ? it : it.skip )('type in input', () => {
    cy.get('#input')
    .type('xyz')
    cy.wait_for_text_to_equal('#input', 'initial inputxyz')
});
( Cypress.env('PHASE') == 2 ? it : it.skip )('double check that output1 and output2 children were not updated', () => {
    // could use JSON fixtures to read expected values
    cy.get('#output1').should('have.text', 'initial output')
    cy.get('#output2').should('have.text', 'initial output')
    cy.percySnapshot(name="simple-callback-1")
});
});

