const is_server = typeof window === 'undefined'
const Client = require('./Client')
const Response = require('./Response')
const {form, request} = require('js-expansion')

class Request {
    constructor(Router, log = false) {
        this.Router = Router
        this.log = log
        this.client = Router.client || Client
        this.bearer_token = Router.bearer_token
        this.data = {
            data: [],
            key: 'id',
            enabled: false,
        }
    }

    prepareFetch(type, name, params = {}) {
        const route = this.Router.routes[type][name] || {}

        if (!route.request) {
            throw `Route ${name} ${this.Router.api_name ? ` in API ${this.Router.api_name}` : ''}, add your route to the Router class.`;
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

        let headers = {}

        if (route.options.form_data) {
            headers = {'Content-Type': 'multipart/form-data'}
            params = form(params)
        }

        return this.fetch(method, url, params, headers)
    }

    fetch(method, url, params = {}, headers = {}) {
        let options = {
            url,
            method,
            headers
        }

        if (['post', 'put'].includes(method)) {
            options.data = params
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
        const config = this.config(options)
        if (['get', 'delete'].includes(options.method)) {
            return this.client[options.method](this.Router.base_url + options.url, config)
        }
        return this.client[options.method](this.Router.base_url + options.url, options.data || {}, config)
    }

    config(options) {
        let config = {headers: options.headers || {}}

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

    index(name, params = {}) {
        return this.prepareFetch('index', name, params)
            .then(response => {
                let data = Response.index(response.data)

                if (this.data.enabled) {
                    data.records = this.data.records.clone().concat(data.data)
                }

                return data
            })
            .catch(error => Response.errorCollection(Response.errors(error)))
    }

    show(name, params = {}) {
        return this.prepareFetch('show', name, params)
            .then(response => {
                response = response.data
                let data = Response.show(response)

                if (this.data.enabled) {
                    data.records = Response.records('save', response, this.data.records, this.data.key)
                }

                return data
            })
            .catch(error => {
                error = Response.errors(error)
                return Response.errorModel(error)
            })
    }

    store(name, params = {}) {
        return this.save('store', name, params)
    }

    update(name, params = {}) {
        params._method = 'put'
        return this.save('update', name, params)
    }

    save(type, name, params = {}) {
        return this.prepareFetch(type, name, params)
            .then(response => {
                if (this.log) {
                    console.log('Save response', response.data)
                }
                response = response.data

                let data = Response.model(response)

                if (this.data.enabled) {
                    data.records = Response.records('save', response, this.data.records, this.data.key)
                }

                return data
            })
            .catch((error) => {
                console.log(error)
                error = Response.errors(error)
                return Response.errorModel(error)
            })
    }

    delete(name, params = {}) {
        return this.prepareFetch('delete', name, params)
            .then(response => {
                response = response.data

                let data = Response.model(response)

                if (this.data.enabled) {
                    data.records = Response.records('delete', params, this.data.records, this.data.key)
                }

                return data
            })
            .catch((error) => {
                error = Response.errors(error)
                return Response.errorModel(error)
            })
    }

    login(params = {}) {
        return this.fetch('post', this.Router.login_url, params)
    }

    logout(params = {}) {
        return this.fetch('post', this.Router.logout_url, params)
    }

    records(records = [], key = 'id') {
        this.data = {
            key,
            records,
            enabled: true,
        }

        return this
    }

    bearerToken(bearer_token) {
        this.bearer_token = bearer_token
        return this
    }
}

module.exports = Request
