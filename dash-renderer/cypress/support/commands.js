/// <reference types="Cypress" />
import 'cypress-wait-until'

// controls how long wait_for* functions are retried for
const DASH_TESTING_TIMEOUT = Cypress.env('DASH_TESTING_TIMEOUT') || 10000

const textContentHelper = ($el) => ($el.text() || $el.attr('value'))

const _until = function(timeout, poll, wait_cond) {
    const wait_condition = 
    cy.waitUntil
}

const _wait_for_callbacks = function(timeout, poll) {
    const _requestQueue = (params) => {
        return (
            cy.window()
            .invoke('getState')
            .its('requestQueue')
            .as('reQueue')
        )
    }
    cy.
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
        timeout: timeout || DASH_TESTING_TIMEOUT // default timeout in dash.testing
    }
}
Cypress.Commands.add('_wait_for_callbacks', _wait_for_callbacks)

// TODO can be refactored to separate wait_cond
const _wait_for_text_to_equal = function(elem_or_selector_, text, timeout = null) {
    return (
	cy.waitUntil(
            () => {
                    return (
                        elem_or_selector_.then(($el) => (
                            ($el.text() === text) && $el.text()
                            || ($el.attr('value') === text) && $el.attr('value')
                        )
                        )
                    )
            },
			{
				errorMsg: 'expected condition not met within timeout',
                interval: 100,
                timeout: timeout || DASH_TESTING_TIMEOUT // default timeout in dash.testing
			}
		)
        .should((elText) => {
            expect(elText).to.eq(text)
        })
)
}

const wait_for_text_to_equal = function() {
    return (
        _wait_for_text_to_equal(..._standardizeFunArgs(...arguments))
    )
}

// Cypress.Commands.add('wait_for_text_to_equal', { prevSubject: 'optional' }, wait_for_text_to_equal)

const percy_snapshot = function(
        name = "",
        wait_for_callbacks = false
     ) {
    const snapshot_name = `${name} - Cypress ${Cypress.config('version')}`
    console.log(`taking snapshot name => ${snapshot_name}`);
    if (wait_for_callbacks) {
        cy.wait(1000)
        cy._wait_for_callbacks(40, 0.3)
    }
    return cy.percySnapshot(name=snapshot_name)
}
Cypress.Commands.add('percy_snapshot', percy_snapshot)


const visit_and_snapshot = function(
        resource_path,
        hook_id,
        wait_for_callbacks=true,
        assert_check=true,
        stay_on_page=false
    ) {
    const path = resource_path.replace(/\/$/, '')
    if (path != resource_path) {
        console.log("we stripped the left '/' in resource_path");
    }
    // TODO check consistent behavior with `expected_conditions'
    cy.visit(`${Cypress.env('SERVER_URL').replace(/\/$/, '')}/${path}`)
    cy.get(`#${hook_id}`, { timeout: timeout || 'DASH_TESTING_TIMEOUT' })
    .then(() => {
        cy.percy_snapshot(path, wait_for_callbacks)
        if (assert_check) {
            //chain with on fail to get custom error message
            cy.get("div.dash-debug-alert")
            .should('not.exist')
        }
        if (!stay_on_page) {
            cy.go('back')
        }
    }
    )
}

Cypress.Commands.add('visit_and_snapshot', visit_and_snapshot)

// Cypress.Commands.add('wait_for_style_to_equal2', (
//         selector, style, val, timeout=null
//     ) => {
//         cy.get(selector, {timeout}).should('have.css', style)
//         .and('be.eq', val)
//     }
// )

const wait_for_element_by_css_selector = function (selector, timeout=null) {
    cy.waitUntil(() => cy.get(selector), {
        timeout: timeout || DASH_TESTING_TIMEOUT
    })
}

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

const select_dcc_dropdown = function() {
    return (
        _select_dcc_dropdown(..._standardizeFunArgs(...arguments))
    )
}


const _standardizeFunArgs_bkup = function() {
    //  added function signature for chainable functions is f(subject, options,...)
    let getSubject
    let i = 1
    if (arguments[0]) {
        getSubject = () => cy.wrap(arguments[0])
    } else {
        getSubject = () => cy.get(arguments[1])
        i += 1
    }
    let argArray = new Array(arguments.length - i)
    for (let j = 0; i < arguments.length; i++ && j++) {
        argArray[j] = arguments[i]
    }
    return [ getSubject, ...argArray ]
}


// 
const _standardizeFunArgs = function() {
    //  added function signature for chainable functions is f(subject, options,...)
    let subject
    let i = 1
    if (arguments[0]) {
        subject = cy.wrap(arguments[0])
    } else {
        subject = cy.get(arguments[1])
        i += 1
    }
    let argArray = new Array(arguments.length - i)
    for (let j = 0; i < arguments.length; i++, j++) {
        argArray[j] = arguments[i]
    }
    return [ subject, ...argArray ]
}

const _select_dcc_dropdown = function(elem_or_selector, value, index) {
    elem_or_selector.click().within(($dd) => {
        cy.wrap($dd).get('div.Select-menu-outer')
        .then(($menu) => {
            console.log(`the available options are ${
                $menu.text().split('\n').join('|')
            }`);
            cy.wrap($menu).get('div.VirtualizedSelectOption').then(($options) => {
                if (
                        Number.isInteger(index)
                        && index < $options.length
                    )
                {
                    cy.wrap($options).eq(index).click()
                } else if (value) {
                    cy.wrap($options).contains(value).click()
                } else {
                    throw new Error('Invalid selection criteria');
                }
            }) // TODO "cannot find matching option using value=%s or index=%s",
        })
    })
}
Cypress.Commands.add(
    'select_dcc_dropdown',
    { prevSubject: 'optional' },
    select_dcc_dropdown
)

// const wait_for_contains_text = 
// Cypress.Commands.add('wait_for_contains_text', (selector, text, timeout = null) => {

// })


const take_snapshot = (
        name,
     ) => {
    // TODO pass in cypress env py version string
    const target = process.platform === 'win32' ? process.env.TEMP : '/tmp/dash_artifacts'
    // check path existence
    cy.task('createIfNotExists', target)
    // handled in dash by selenium\webdriver\chrome\webdriver.py
    cy.screenshot(`${target}/${name}_${Cypress.spec.name.replace(/(\.spec)?(\.js)?$/, '')}.png`)
}
Cypress.Commands.add('take_snapshot', take_snapshot)