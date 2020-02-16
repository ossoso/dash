// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
let percyHealthCheck = require('@percy/cypress/task')
const fs = require('fs')

const testingHooks = () => {
}

module.exports = (on, config) => {
  // used for pytest checks of reporting failed tests
  on('task', {
    failed: require('cypress-failed-log/src/failed')(),
  })
  require('cypress-terminal-report').installPlugin(on);
  on("task", percyHealthCheck);
  on('task', {
    createIfNotExists (pathStr) {
      if (!fs.existsSync(pathStr)) {
        fs.mkdirSync(pathStr)
        return pathStr
      } else {
        return null
      }
    }
  })
  // hooks for testing
  on('task', {
    getProcEnv() {
      return process.env
    }
  })
  // config modification only applied at cypress startup
  // these environment variables do not appear in Cypress.config
  config.env.DASH_TESTING_TIMEOUT = process.env.DASH_TESTING_TIMEOUT || 10000
  config.env.SNAPSHOT_ = 1
  return config
};
