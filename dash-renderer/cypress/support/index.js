// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
require('cypress-failed-log')
import '@percy/cypress'
import './commands'

// Cypress.on('uncaught:exception', (err, runnable) => {
//     // returning false here prevents Cypress from
//     // failing the test
//     if (err instanceof  3) {
        
//     }
//     try {
        
//     } catch (responseTimout) {
//         console.error("expected condition not met within timeout")
//     }
//     return false
// })

// Alternatively you can use CommonJS syntax:
// require('./commands')
