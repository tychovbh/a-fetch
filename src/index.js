require('js-expansion')
const Router = require('./Router')
const Fetcher = require('./Fetcher')
const Client = require('./Client')
const Request = require('./Request')

module.exports = Fetcher
module.exports.Router = Router
module.exports.Client = Client
module.exports.Request = Request
