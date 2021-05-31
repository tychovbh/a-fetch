const axios = require('axios')

class Router {
    constructor() {
        this.apis = {}
        this.base_url = ''
        this.csrf_url = ''
        this.login_url = ''
        this.logout_url = ''
        this.client = axios.create({})
        this.routes = {
            show: {},
            index: {},
            store: {},
            update: {},
            delete: {},
        }
    }

    addRoute(type, name, request, options = {}) {
        this.routes[type][name] = {
            request: this.base_url + request,
            options
        }
        return this
    }

    show(name, request, options) {
        return this.addRoute('show', name, request, options)
    }

    index(name, request, options) {
        return this.addRoute('index', name, request, options)
    }

    store(name, request, options) {
        return this.addRoute('store', name, request, options)
    }

    update(name, request, options) {
        return this.addRoute('update', name, request, options)
    }

    delete(name, request, options) {
        return this.addRoute('delete', name, request, options)
    }

    clientCreate(base_url, csrf_url = '') {
        return axios.create({
            baseURL: base_url,
            withCredentials: !!csrf_url
        })
    }

    baseURL(base_url, csrf_url = '', login_url = '', logout_url = '') {
        this.current = ''
        this.base_url = base_url
        this.csrf_url = csrf_url
        this.login_url = login_url
        this.logout_url = logout_url
        this.client = this.clientCreate(base_url, csrf_url)
        return this
    }

    loginUrl(login_url) {
        this.login_url = login_url
        return this
    }

    logoutUrl(logout_url) {
        this.logout_url = logout_url
        return this
    }

    api(name, base_url = '', csrf_url = '', login_url = '', logout_url = '') {
        const router = new Router()
        router.baseURL(base_url, csrf_url, login_url, logout_url)
        this.apis[name] = router
        return router
    }

    getApi(name) {
        return this.apis[name]
    }
}

module.exports = new Router()
