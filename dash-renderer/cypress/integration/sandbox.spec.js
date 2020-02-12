/// <reference types="Cypress" />
context('testing cy', () => {
    // beforeEach(() => {
    //     cy.visit('http://localhost:8050')
    // })
    it.skip('visit with trailing slash', () => {
        cy.visit("http://google.com/".replace(/\/$/, ''))
    });
    it('store request queue', () => {
        cy.window()
            .its('store')
            .invoke('getState')
            .its('requestQueue').then($q =>{
                $q.reduce((a, b) => a && b, false)
            }
            )
            .as('reduxReqs')

        // cy.window().its('store').invoke('getState').then((state) => {
        //     cy.log(
        //         `req queue has value ${state.requestQueue}`
        //         // JSON.stringify(state, null, 4)
        //     )
        // })
    });
    it('cypress wd', () => {
        Cypress.config('env', 'testi')
        // cy.log(JSON.stringify(Cypress.env('testi')))
        cy.log(process.env)
    });
    it('style', () => {
        cy.get('#input').type(' hello')
        cy.wait_for_style_to_equal('#output', 'font-family', 'dash hello', 10000)
    });
    //passes
    it('selectdropdown', () => {
        cy.select_dcc_dropdown('#dd', null, 1)
    });
    //passes
    it.only('visit and snapshot google', () => {
        // cy.task('getProcEnv').then((env) => {
            // cy.log(JSON.stringify(env));
        // })
        // cy.log(`${Object.keys(process.env)}`)
        cy.visit_and_snapshot('', 'ctt_inpage_style')
    })
    //passes
    it.skip('take_snapshot', () => {
        cy.visit('http://google.com')
        cy.take_snapshot('test')
    })
});