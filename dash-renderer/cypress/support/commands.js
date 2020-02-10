/// <reference types="Cypress" />
import 'cypress-wait-until'
import 'fs'

const DASHT_BROWSER_TIMEOUT = 10000

const textContentHelper = ($el) => ($el.text() || $el.attr('value'))

const _wait_for_callbacks = function(timeout, poll) {
    const _requestQueue = (params) => {
        return (
            cy.window()
            .invoke('getState')
            .its('requestQueue')
        )
    }
    cy.waitUntil(() => cy.window()
    .then(win => {
            if (win.store) {
                return (
                    cy.wrap(win.store)
                    .invoke('getState')
                    .its('requestQueue').then($q => {
                        const controllerIDd = $q.filter(x => x.controllerId)
                        controllerIDd.length !== 0
                        && controllerIDd.every(x => x.responseTime)
                    })
                )
            } else {
                return true
            }
        })
    ),
    {
        // TODO detail in errorMsg failed requests and contents perhaps through callbackFn
        errorMsg: (async () => {
            return (
                `wait_for_callbacks failed => status of invalid rqs: ${
                                await JSON.stringify(
                                    _requestQueue()
                                    .filter((request) => !request.responseTime)
                                )
                }`
            )
        }),
        interval: poll*1000,
        timeout: timeout || 10000 // default timeout in dash.testing
    }
}
Cypress.Commands.add('_wait_for_callbacks', _wait_for_callbacks)

// TODO can be refactored to separate wait_cond
const wait_for_text_to_equal = function(selector, text, timeout = null) {
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
                timeout: timeout || DASHT_BROWSER_TIMEOUT // default timeout in dash.testing
			}
		)
        .should((elText) => {
            expect(elText).to.eq(text)
        })
}
Cypress.Commands.add('wait_for_text_to_equal', wait_for_text_to_equal)

const percy_snapshot = function(
        name = "",
        wait_for_callbacks = false
     ) {
    // TODO pass in cypress env py version string
    const snapshot_name = `${name} - ${process.env.PY_VERSION}`
    console.log(`taking snapshot name => ${snapshot_name}`);
    if (wait_for_callbacks) {
        cy.wait(1000)
        cy._wait_for_callbacks(timeout=40, poll=0.3)
    }
    cy.percySnapshot(name=snapshot_name)
    // cy.get(path, { timeout: timeout || DASHT_BROWSER_TIMEOUT })
	// cy.waitUntil(
    //         () => {
    //                 return (
    //                     cy.get(selector).then(($el) => (
    //                         ($el.text() === text) && $el.text()
    //                         || ($el.attr('value') === text) && $el.attr('value')
    //                     )
    //                     )
    //                 )
    //         },
	// 		{
	// 			errorMsg: 'expected condition not met within timeout',
    //             interval: 100,
    //             timeout: timeout*1000 || 10000 // default timeout in dash.testing
	// 		}
	// 	)
}
Cypress.Commands.add('percy_snapshot', percy_snapshot)


const visit_and_snapshot = function(
        resource_path,
        hook_id,
        wait_for_callbacks=True,
        assert_check=True,
        stay_on_page=False
    ) { 
    const path = resource_path.replace(/\/$/, '')
    if (path != resource_path) {
        console.log("we stripped the left '/' in resource_path");
    }
    // TODO check consistent behavior with `expected_conditions'
    cy.visit(`${process.env.SERVER_URL.replace(/\/$/, '')}\
    /${path})`)
    cy.get(`#${hook_id}`, { timeout: timeout || DASHT_BROWSER_TIMEOUT })
    cy.percy_snapshot(path, wait_for_callbacks=wait_for_callbacks)
    if (assert_check) {
        //chain with on fail to get custom error message
        cy.get("div.dash-debug-alert")
        .should('not.exist')
    }
    if (!stay_on_page) {
        cy.go('back')
    }
}
Cypress.Commands.add('visit_and_snapshot', )

Cypress.Commands.add('wait_for_style_to_equal2', (
        selector, style, val, timeout=null
    ) => {
        cy.get(selector, {timeout}).should('have.css', style)
        .and('be.eq', val)
    }
)

Cypress.Commands.add('wait_for_style_to_equal', (
        selector, style, val, timeout=null
    ) => cy.waitUntil(() => {
        return (
            cy.get(selector)
            .then(($el) => {
                    if (
                        $el.style
                        && ($el.style.getPropertyValue(style) === val)
                    ) return $el
            })
        )
    },
    { timeout })
)

const select_dcc_dropdown = function(element, arg1, arg2, arg3) {
    if (element) {
        const value = arg1
        const index = arg2
        const getSubject = () => cy.wrap(element)
    } else {
        const selector = arg1
        const value = arg2
        const index = arg3
        const getSubject = () => cy.get(selector)
    }
    getSubject().get()
}
Cypress.Commands.add('select_dcc_dropdown', { prevSubject: 'optional' }, ())

const wait_for_contains_text = 
Cypress.Commands.add('wait_for_contains_text', (selector, text, timeout = null) => {

})


const take_snapshot = (
        name,
     ) => {
    // TODO pass in cypress env py version string
    const target = process.platform === 'win32' ? process.env.TEMP : '/tmp/dash_artifacts'
    // check path existence
    if (!fs.existsSync('target')) {
        fs.mkdirSync(target)
    }
    /* handled in dash by selenium\webdriver\chrome\webdriver.py
    */
    cy.screenshot(`${target}/${name}_${Cypress.spec.name.replace(/(\.spec)?(\.js)?$/, '')}.png`)
}
Cypress.Commands.add('take_snapshot', )

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
