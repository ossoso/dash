//     def __init__(self, selector, text):
//         self.selector = selector
//         self.text = text

//     def __call__(self, driver):
//         try:
//             elem = driver.find_element_by_css_selector(self.selector)
//             logger.debug(
//                 "text to equal {%s} => expected %s", elem.text, self.text
//             )
//             return (
//                 str(elem.text) == self.text
//                 or str(elem.get_attribute("value")) == self.text
//             )
//         except WebDriverException:
//             logger.exception("text_to_equal encountered an exception")
//             return False




    // def _wait_for(self, method, args, timeout, msg):
    //     """Abstract generic pattern for explicit WebDriverWait."""
    //     _wait = (
    //         self._wd_wait
    //         if timeout is None
    //         else WebDriverWait(self.driver, timeout)
    //     )
    //     logger.debug(
    //         "method, timeout, poll => %s %s %s",
    //         method,
    //         _wait._timeout,  # pylint: disable=protected-access
    //         _wait._poll,  # pylint: disable=protected-access
    //     )



const wait_for_text_to_equal = (selector, text, timeout=null) => {
    try {
        cy.get(selector).wait(timeout=timeout).as(textEl)
        cy.get('@textEl').
        its('text')
        // logger.debug(
        //     "text to equal {%s} => expected %s", elem.text, self.text
        // )

    } catch (responseTimout) {
        
    }
}
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
