const axios = require('axios')
require('js-expansion')
const {form, request} = require('js-expansion')

class Router {
    constructor() {
        this.routes = {
            show: {},
            index: {},
            store: {},
            update: {},
            delete: {},
        }
    }

    addRoute(type, name, request, location = '') {
        this.routes[type][name] = {
            request,
            location,
        }
    }

    route(type, name) {
        return this.routes[type][name] || ''
    }

    show(name, request, location) {
        this.addRoute('show', name, request, location)
    }

    index(name, request, location) {
        this.addRoute('index', name, request, location)
    }

    store(name, request, location) {
        this.addRoute('store', name, request, location)
    }

    update(name, request, location) {
        this.addRoute('update', name, request, location)
    }

    delete(name, request, location) {
        this.addRoute('delete', name, request, location)
    }
}

class Fetcher {
    constructor() {
        this.log = false
        this.router = new Router()
        this.headers = {}
        this.base_url = ''
        this.route = {}

        this.collection = {
            loading: true,
            data: [],
            errors: [],
            meta: {},
        }

        this.model = {
            loading: true,
            data: {},
            errors: [],
        }
    }

    debug(enabled = true) {
        this.log = enabled
    }

    emptyResponse(data, route) {
        const message = `Route: ${route} not found`
        if (this.log) {
            console.log('Request error', message)
        }

        return new Promise((resolve, reject) => {
            resolve({
                ...data,
                errors: [message],
            })
        })
    }

    token(token) {
        this.headers['Authorization'] = `Bearer ${token}`
    }

    index(name, params = {}, records = []) {
        return this.fetch('index', name, params)
            .then(response => {
                response = response.data
                let data = this.collection
                response = response[this.route.location] || response

                if (Array.isArray(response)) {
                    data.data = response
                } else if (typeof response === 'object') {
                    data = {...data, ...response}
                }

                return {
                    ...data,
                    data: records.clone().concat(data.data),
                    loading: false,
                }
            })
            .catch(error => {
                if (this.log) {
                    console.log('Fetch', error)
                }
                return {
                    ...this.collection,
                    errors: error,
                    loading: false,
                }
            })
    }

    show(name, params = {}) {
        return this.fetch('show', name, params)
            .then(response => {
                response = response.data
                response = response[this.route.location] || response

                return {
                    ...this.model,
                    data: response || this.model.data,
                    loading: false,
                }
            })
            .catch(error => {
                if (this.log) {
                    console.log('Fetch', error)
                }
                return {
                    ...this.model,
                    errors: error,
                    loading: false,
                }
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
        return this.fetch(type, name, params)
            .then(response => {
                response = response.data
                response = response[this.route.location] || response

                if (records.length) {
                    return {
                        ...this.collection,
                        data: records.clone().save(params[key], key),
                        loading: false,
                    }
                }

                return {
                    ...this.model,
                    data: response || this.model.data,
                    loading: false,
                }
            })
            .catch((error) => {
                if (this.log) {
                    console.log('Fetch', error)
                }
                if (records.length) {
                    return {
                        ...this.collection,
                        data: records,
                        loading: false,
                    }
                }

                return {
                    ...this.model,
                    errors: error,
                    loading: false,
                }
            })
    }

    fetch(type, name, params = {}) {
        this.route = this.router.route(type, name)

        if (this.route === '') {
            return this.emptyResponse(this.model, name)
        }

        let options = {
            method: 'get',
        }

        if (['store', 'update'].includes(type)) {
            options.data = form(params)
            options.method = type === 'store' ? 'post' : 'put'
            options.headers = {'Content-Type': 'multipart/form-data'}
        }

        if (type === 'delete') {
            options.method = 'delete'
        }

        options.url = this.base_url + request(options.method, this.route.request, params)

        if (this.log) {
            console.log('Request', options, params)
        }
        return axios(options)
    }

    delete(method, name, params = {}, records = [], key = 'ids') {
        return this.fetch('delete', name, params)
            .then(response => {
                response = response.data
                response = response[this.route.location] || response

                if (records.length) {
                    return {
                        ...this.collection,
                        data: records.clone().delete(params[key], key),
                        loading: false,
                    }
                }

                return {
                    ...this.model,
                    data: response || this.model.data,
                    loading: false,
                }
            })
            .catch((error) => {
                if (records.length) {
                    return {
                        ...this.collection,
                        data: records,
                        loading: false,
                    }
                }

                return {
                    ...this.model,
                    errors: error,
                    loading: false,
                }
            })
    }
}

module.exports = new Fetcher()
