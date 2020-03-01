/// <reference types="Cypress" />
const jammedStoreObj = {store: { getState: () => {
    return {requestQueue: [
        {
            'status': 200,
            'requestTime': 1572637143419,
            'uid': 'ba5537d0-617e-8488-94b8-0743ae70833e',
            'controllerId': 'chapter.children',
            'rejected': false,
        }
    ]}
}}}
const emptyStoreObj = {store: { getState: () => {
    return {requestQueue: []}
}}}
const drainedStoreObj = {store: { getState: () => {
    return {requestQueue: [
        {
            'status': 200,
            'requestTime': 1572637143419,
            'uid': 'ba5537d0-617e-8488-94b8-0743ae70833e',
            'controllerId': 'chapter.children',
            'rejected': false,
            'responseTime': 1572637143451
        }
    ]}
}}}
const stubStates = {
    jammedState: { requestQueue: [
            {
                'status': 200,
                'requestTime': 1572637143419,
                'uid': 'ba5537d0-617e-8488-94b8-0743ae70833e',
                'controllerId': 'chapter.children',
                'rejected': false,
            }
        ]},
    emptyState: { requestQueue: []},
    resolvedState: { requestQueue: [
        {
            'status': 200,
            'requestTime': 1572637143419,
            'uid': 'ba5537d0-617e-8488-94b8-0743ae70833e',
            'controllerId': 'chapter.children',
            'rejected': false,
            'responseTime': 1572637143451
        }
    ]}
}

context('waiting helpers', () => {
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
    context('waiting for text to equal', () => {
        const chainRepeatedly = function(subject, fname, n, args) {
            let results = cy.wrap(subject)
            for (let i = 0; i < n; i++) {
                results = results[fname](args)
            }
        }
        it('found seeked initially present item', () => {
            cy.wait_for_text_to_equal('#n3', 'initial3')
        });
        it('found seeked dynamically appearing elements ', () => {
            cy.get('#btn')
            .then(($button) => {
                chainRepeatedly($button, 'click', 10)
            })
            cy.wait_for_text_to_equal('#n2', '2')
            cy.wait_for_text_to_equal('#n1', '4')
        });
        it('missing not found', (done) => {
            const selector = '#nonexisting'
            const text = 'asd'
            const timeout = 1
            Cypress.once("fail", (err, _) => expect(err.message)
            .to.be.equal(`text -> ${text} not found within ${timeout}s`))
            cy.wait_for_text_to_equal(selector, text, timeout, done)
        });
    })
    context('waiting for callbacks', () => {
        const stubAndListen = (state, done) => {
            cy.window()
            .then((win) => {
                win.store = {}
                win.store.getState = () => state
            })
            cy.on("fail", err => {
                expect(err.message).to.eq(`wait_for_callbacks failed => status of invalid rqs: ${
                    JSON.stringify(
                        state.requestQueue
                    )}`
                );
                done()
                return false
            })
        }
        beforeEach(() => {
            cy.visit('http://localhost:8050')
        })
        it('helper invalidates queue', (done) => {
            stubAndListen(stubStates.jammedState, done)
            cy._wait_for_callbacks(0.5, 0.2)
        });
        it('helper validates queue (matching responseTime)', () => {
            // FIXME Does not really test for failed callbacks
            stubAndListen(stubStates.resolvedState, done)
            cy._wait_for_callbacks()
        });
        it('helper validates empty queue', () => {
            // FIXME Does not really test for failed callbacks
            stubAndListen(stubStates.emptyState, done)
            cy._wait_for_callbacks()
        });
    });
    context('percy snapshot', () => {
        it('callbacks remaining in requests', () => {
            Cypress.Commands.overwrite('window', () => {
                return storeObj
            })
            cy.percy_snapshot('snapshot_fails_cb', true)
        });
        it('no obstacles', () => {
            cy.percy_snapshot('snapshot_succeeds', false)
        });
    });
});