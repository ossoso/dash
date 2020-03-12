/// <reference types="Cypress" />
context.skip('testing cy', () => {
    // // beforeEach(() => {
    // //     cy.visit('http://localhost:8050')
    // // })
    // it.skip('visit with trailing slash', () => {
    //     cy.visit("http://google.com/".replace(/\/$/, ''))
    // });
    // it('store request queue', () => {
    //     cy.window()
    //         .its('store')
    //         .invoke('getState')
    //         .its('requestQueue').then($q =>{
    //             $q.reduce((a, b) => a && b, false)
    //         }
    //         )
    //         .as('reduxReqs')

    //     // cy.window().its('store').invoke('getState').then((state) => {
    //     //     cy.log(
    //     //         `req queue has value ${state.requestQueue}`
    //     //         // JSON.stringify(state, null, 4)
    //     //     )
    //     // })
    // });
    // it('cypress wd', () => {
    //     Cypress.config('env', 'testi')
    //     // cy.log(JSON.stringify(Cypress.env('testi')))
    //     cy.log(process.env)
    // });
    // it('style', () => {
    //     cy.get('#input').type(' hello')
    //     cy.wait_for_style_to_equal('#output', 'font-family', 'dash hello', 10000)
    // });
    // //passes
    // it('selectdropdown', () => {
    //     cy.select_dcc_dropdown('#dd', null, 1)
    // });
    // //passes
    // it('visit and snapshot google', () => {
    //     // cy.task('getProcEnv').then((env) => {
    //         // cy.log(JSON.stringify(env));
    //     // })
    //     // cy.log(`${Object.keys(process.env)}`)
    //     cy.visit_and_snapshot('', 'ctt_inpage_style')
    // })
    // //passes
    // it.skip('take_snapshot', () => {
    //     cy.visit('http://google.com')
    //     cy.take_snapshot('test')
    // })
    // context('attr vs text', () => {
    //     it('val instead of attr examined', () => {
    //         cy.get('#initItem').invoke('text').should('be.eq', 'initItem')
    //         cy.get('#initItem').invoke('attr', 'value').log()
    //         cy.get('#initItem').invoke('val').log()
    //     });
    // });
    // Cypress.Commands.add('test', () => {
    //     cy.once('fail', () => {
    //         throw new Error('should catch tiemouterror')
    //         done()
    //     })
    //     cy.get('#lulu')
    //     cy
    // })
    // it('test not existing', () => {
    //     cy.test()
    // });
    // it('trytocatch', () => {
    //     Cypress.Commands.add('prodCypressError', () => {
    //         throw new Error('asd')
    //     })
    //     cy.get('#111', { timeout: 100 })
    //     cy.wait()
    // });
    it('rq helper', () => {

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

        // cy.log(cy._requestQueue())
        cy.window()
        .then((win) => {
            win.store = {}
            win.store.getState = () => {
    return {requestQueue: [
        {
            'status': 200,
            'requestTime': 1572637143419,
            'uid': 'ba5537d0-617e-8488-94b8-0743ae70833e',
            'controllerId': 'chapter.children',
            'rejected': false,
        }
    ]}
}
        })
        cy.window()
        .its('store')
        .invoke('getState')
        .its('requestQueue')
        .then((q) => cy.log(q))
    })
});
describe('custom error', () => {

  // Ref: https://docs.cypress.io/api/events/catalog-of-events.html#Catching-Test-Failures
  it('fails with custom error message', () => {
    cy.on('fail', (error, runnable) => {
      error.name = 'CustomError'
      error.message = 'Incorrect, 1 !== 2'
      throw error // throw error to have test still fail
    })
    cy.wrap(1).should('eq', 2)
  })


  /*
    Ref: https://docs.cypress.io/api/cypress-api/custom-commands.html#Child-Commands
    Add this to /cypress/support/commands.js
  */
  Cypress.Commands.add('onFail', { prevSubject: true }, (chainedSubject, message) => {
    cy.once('fail', (error, runnable) => {
      error.name = 'CustomError'
      error.message = 'err1'

      cy.emit('fail', error, runnable)
      throw error// throw error to have test still fail
    })
    return chainedSubject
  })

  Cypress.Commands.add('onFail2', { prevSubject: true }, (chainedSubject, message) => {
    cy.prependListener('fail', (error, runnable) => {
      error.name = 'CustomError'
      error.message = 'err2'
      throw error // throw error to have test still fail
    })
    return chainedSubject
  })


  Cypress.Commands.add('chainExpectError', { prevSubject: true }, (chainedSubject, message) => {
    cy.on('fail', (error, runnable) => {
        expect(err.name).to.eq('CustomError');
        throw new Error('lul')
    })
    return chainedSubject
  })

  it.only('fails with custom message via command', () => {
    // cy.log(cy.listeners('fail'))
    cy.on('fail', () => console.log('tulli'))
    console.log(JSON.stringify(cy.listeners('fail')))
    cy.wrap(1).onFail().onFail().should('eq', 2).chainExpectError()
  })


  /*
    Ref: https://docs.cypress.io/api/cypress-api/custom-commands.html#Overwrite-Existing-Commands
    Add this to /cypress/support/commands.js
  */
  Cypress.Commands.overwrite('should', (originalFn, actual, assertion, expected, options) => {
    if (options && options.message) {
      cy.on('fail', (error, runnable) => {
        error.name = 'CustomError'
        error.message = options.message
        throw error // throw error to have test still fail
      })
    }
    return originalFn(actual, assertion, expected, options)
  })

  it('fails with custom message via overwrite of should', () => {
    cy.wrap(1).should('eq', 2, { message: 'Incorrect: 1 !== 2'})
  })


  it('fails with standard message', () => {
    cy.wrap(1).should('eq', 2)
  })
})