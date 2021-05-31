require('js-expansion')
const Router = require('./Router')
const Fetcher = require('./Fetcher')
const Variables = require('./variables')

module.exports = {
    Router,
    Variables,
    default: Fetcher
}
