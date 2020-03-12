/// <reference types="Cypress" />
context('select_dcc_dropdown', () => {
    const dropdownGetters = [
        {
            subjType: 'selector',
            dropdownGetter: (elem_or_selector, value, index) => (
                cy.select_dcc_dropdown(elem_or_selector, value, index)
            )
        },
        {
            subjType: 'element',
            dropdownGetter: (elem_or_selector, value, index) => (
                cy.get(elem_or_selector).select_dcc_dropdown(value, index)
            )
        }
    ]
    it('also fails', () => {
        expect(1).to.eq(2)
    });
    it('always fail', () => {
        expect(1).to.eq(2)
    });
    dropdownGetters.forEach(({ subjType: kind, dropdownGetter }) => {
        context(`dropdown by ${kind}`, () => {
            beforeEach(() => {
                cy.visit('http://localhost:8050')
                cy.get('#dropdown-2').as('dd2')
            });
            it('selection by index', () => {
                dropdownGetter('#dropdown-2', null, 0)
                cy.get('@dd2')
                .contains('a')
                .should('be.visible')
                cy.get('@dd2')
                .should('not.contain', 'b')
            });
            context('selection by value', () => {
                it('single matching', () => {
                    dropdownGetter('#dropdown-2', 'a', null)
                    cy.get('@dd2')
                    .contains('a')
                    .should('be.visible')
                    cy.get('@dd2')
                    .should('not.contain', 'b')
                });
                it('multiple ', () => {
                    dropdownGetter('#dropdown-2', 'dup', null)
                    cy.get('@dd2')
                    .contains('dup')
                    .should('be.visible')
                });
            });
            it('dropdown invalid arguments', () => {
                cy.once("fail", err => {
                    expect(err.message).to.be.equal('Invalid selection criteria');
                });
                dropdownGetter('#dropdown-1', null, null)
            });
        });
    })
});