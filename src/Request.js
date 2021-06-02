const Response = require('./Response')
const {form, request} = require('js-expansion')
const is_server = typeof window === 'undefined'
const Client = require('./Client')

class Request {
    constructor(Router, log = false) {
        this.Router = Router
        this.log = log
        this.client = Router.client || Client
        this.bearer_token = Router.bearer_token
    }

    prepareFetch(type, name, params = {}) {
        if (params.bearer_token) {
            this.bearer_token = params.bearer_token
            delete params.bearer_token
        }

        const route = this.Router.routes[type][name] || {}

        if (!route.request) {
            return Response.empty(this.model, name)
        }

        const methods = {
            index: 'get',
            show: 'get',
            store: 'post',
            update: 'put',
            delete: 'delete',
        }

        const method = methods[type]
        const url = request(method, route.request, params)

        return this.fetch(method, url, params)
    }

    fetch(method, url, params = {}) {
        let options = {
            url,
            method,
        }

        if (['post', 'put'].includes(method)) {
            options.data = params
            // options.data = params
            // options.headers = {'Content-Type': 'multipart/form-data'}
        }

        if (this.log) {
            console.log('Route', url)
            console.log('Request', options)
        }

        if (this.csrfRequired(options)) {
            return this.requestWithCsrf(options)
        }

        return this.request(options)
    }

    request(options) {
        const config = this.config()
        if (options.method === 'get') {
            return this.client[options.method](this.Router.base_url + options.url, config)
        }
        return this.client[options.method](this.Router.base_url + options.url, options.data || {}, config)
    }

    config() {
        let config = {headers: {}}

        if (this.bearer_token !== '') {
            config.headers.Authorization = `Bearer ${this.bearer_token}`
        }

        return config
    }

    csrfRequired(options) {
        return !is_server && this.Router.csrf_url && options.method !== 'get' && !document.cookie.includes('XSRF-TOKEN')
    }

    requestWithCsrf(options) {
        if (this.log) {
            console.log('Request with CSRF')
        }

        return this.request({
            method: 'get',
            url: this.Router.csrf_url,
        }).then(() => {
            return this.request(options)
        })
    }

    index(name, params = {}, records = []) {
        return this.prepareFetch('index', name, params)
            .then(response => Response.index(response.data, records))
            .catch(error => Response.errorCollection(Response.errors(error), records))
    }

    show(name, params = {}, records = [], key = 'id') {
        return this.prepareFetch('show', name, params)
            .then(response => {
                response = response.data

                if (records) {
                    Response.records('save', response, records, key)
                }

                return Response.show(response)
            })
            .catch(error => {
                error = Response.errors(error)
                if (records.length) {
                    return Response.errorCollection(error, records)
                }

                return Response.errorModel(error)
            })
    }

    store(name, params = {}, records = [], key = 'id') {
        return this.save('store', name, params, records, key)
    }

    update(name, params = {}, records = [], key = 'id') {
        params._method = 'put'
        return this.save('update', name, params, records, key)
    }

    save(type, name, params = {}, records = [], key = 'id') {
        return this.prepareFetch(type, name, params)
            .then(response => {
                if (this.log) {
                    console.log('Save response', response.data)
                }
                response = response.data
                if (records.length) {
                    return Response.records('save', response, records, key)
                }

                return Response.model(response)
            })
            .catch((error) => {
                error = Response.errors(error)
                if (records.length) {
                    Response.errorCollection(error, records)
                }

                return Response.errorModel(error)
            })
    }

    delete(name, params = {}, records = [], key = 'id') {
        return this.prepareFetch('delete', name, params)
            .then(response => {
                response = response.data

                if (records.length) {
                    return Response.records('delete', response, records, key)
                }

                return Response.model(response)
            })
            .catch((error) => {
                error = Response.errors(error)
                if (records.length) {
                    return Response.errorCollection(error, records)
                }

                return Response.errorModel(error)
            })
    }

    login(params = {}) {
        return this.fetch('post', this.Router.login_url, params)
    }

    logout(params = {}) {
        return this.fetch('post', this.Router.logout_url, params)
    }

    bearerToken(bearer_token) {
        this.bearer_token = bearer_token
        return this
    }
}

module.exports = Request
