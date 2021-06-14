const Router = require('./Router')
const Request = require('./Request')
const Variables = require('./variables')

class Fetcher {
    static api(api, debug = false) {
        const router = Router.getApi(api)
        return new Request(router, debug)
    }

    static request(debug = false) {
        return new Request(Router, debug)
    }

    static index(name, params = {}, records = [], debug = false) {
        return Fetcher.request(debug).index(name, params, records)
    }

    static show(name, params = {}, records = [], key = 'id', debug = false) {
        return Fetcher.request(debug).show(name, params, records, key)
    }

    static store(name, params = {}, records = [], key = 'id', debug = false) {
        return Fetcher.request(debug).store(name, params, records, key)
    }

    static update(name, params = {}, records = [], key = 'id', debug = false) {
        return Fetcher.request(debug).update(name, params, records, key)
    }

    static delete(name, params = {}, records = [], key = 'id', debug = false) {
        return Fetcher.request(debug).delete(name, params, records, key)
    }

    static login(params = {}, debug = false) {
        return Fetcher.request(debug).login(params)
    }

    static logout(params = {}, debug = false) {
        return Fetcher.request(debug).logout(params)
    }

    static bearerToken(token, debug = false) {
        return Fetcher.request(debug).bearerToken(token)
    }

    static collection() {
        return Variables.collection
    }

    static model() {
        return Variables.model
    }
}

module.exports = Fetcher
