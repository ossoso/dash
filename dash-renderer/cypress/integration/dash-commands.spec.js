/// <reference types="Cypress" />
context('waiting helpers', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8050')
    });
    const testing_select_dcc_dropdown = [
        {subjType: 'selector', fun: (elem_or_selector, value, index) => cy.select_dcc_dropdown(elem_or_selector, value, index)},
        {subjType: 'element', fun: (elem_or_selector, value, index) => cy.get(elem_or_selector).select_dcc_dropdown(value, index)}
    ]
    testing_select_dcc_dropdown.forEach(({ subjType: kind, fun }) => {
        context(`dropdown by ${kind}`, () => {
            beforeEach(() => {
                cy.get('#dropdown-2').as('dd2')
            });
            it('selection by index', () => {
                fun('#dropdown-2', null, 0)
                cy.get('@dd2')
                .contains('a')
                .should('be.visible')
                cy.get('@dd2')
                .should('not.contain', 'b')
            });
            context('selection by value', () => {
                it('single matching', () => {
                    fun('#dropdown-2', 'a', null)
                    cy.get('@dd2')
                    .contains('a')
                    .should('be.visible')
                    cy.get('@dd2')
                    .should('not.contain', 'b')
                });
                it('multiple ', () => {
                    fun('#dropdown-2', 'dup', null)
                    cy.get('@dd2')
                    .contains('dup')
                    .should('be.visible')
                });
            });
            it('dropdown invalid arguments', () => {
                cy.on("fail", err => {
                    expect(err.message).to.be.equal('Invalid selection criteria');
                });
                fun('#dropdown-1', null, null)
            });
        });
    })
});