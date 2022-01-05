const Router = require('./Router')
const Request = require('./Request')
const Variables = require('./Variables')

class Fetcher {
    static api(api, debug = false) {
        const router = Router.getApi(api)
        return new Request(router, debug)
    }

    static request(debug = false) {
        return new Request(Router, debug)
    }

    static index(name, params = {}, headers = {}, debug = false) {
        return Fetcher.request(debug).index(name, params, headers)
    }

    static show(name, params = {}, headers = {}, debug = false) {
        return Fetcher.request(debug).show(name, params, headers)
    }

    static store(name, params = {}, headers = {}, debug = false) {
        return Fetcher.request(debug).store(name, params, headers)
    }

    static update(name, params = {}, headers = {}, debug = false) {
        return Fetcher.request(debug).update(name, params, headers)
    }

    static delete(name, params = {}, headers = {}, debug = false) {
        return Fetcher.request(debug).delete(name, params, headers)
    }

    static login(params = {}, headers = {}, debug = false) {
        return Fetcher.request(debug).login(params, headers)
    }

    static logout(params = {}, headers = {}, debug = false) {
        return Fetcher.request(debug).logout(params, headers)
    }

    static records(records = [], value_key = 'id', records_key = 'id', debug = false) {
        return Fetcher.request(debug).records(records, value_key, records_key)
    }

    static bearerToken(token, debug = false) {
        return Fetcher.request(debug).bearerToken(token)
    }

    static withExpress(req, res) {
        return Fetcher.request().withExpress(req, res)
    }

    static collection() {
        return Variables.collection
    }

    static model() {
        return Variables.model
    }
}

module.exports = Fetcher
