/// <reference types="Cypress" />
context('testing cy', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8050')
    }
    )
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
    it.only('style', () => {
        cy.get('#input').type(' hello')
        cy.wait_for_style_to_equal('#output', 'font-family', 'dash hello', 10000)
        // cy.waitUntil(() => {
        //         return cy.get('#output').then((a)=>a)
        //     })
            // cy.waitUntil(() => {
            //     cy.log($htmlEl.style.getPropertyValue('font-family'))
            //     // cy.log($divEl.style)
            //         // .getPropertyValue('font-family'))
            //     $divEl.style.getPropertyValue('font-family') == 'dash'
            //     return true
            // })
    })
});