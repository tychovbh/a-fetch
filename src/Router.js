class Router {
    constructor() {
        this.apis = {}
        this.api_name = null
        this.base_url = ''
        this.csrf_url = ''
        this.login_url = ''
        this.logout_url = ''
        this.bearer_token = ''
        this.client = null
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
            request: request,
            options,
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

    baseURL(base_url, csrf_url = '', login_url = '', logout_url = '') {
        this.base_url = base_url
        this.csrf_url = csrf_url
        this.login_url = login_url
        this.logout_url = logout_url
        return this
    }

    loginURL(login_url) {
        this.login_url = login_url
        return this
    }

    logoutURL(logout_url) {
        this.logout_url = logout_url
        return this
    }

    csrfURL(csrf_url) {
        this.csrf_url = csrf_url
        return this
    }

    bearerToken(bearer_token) {
        this.bearer_token = bearer_token
        return this
    }

    api(name, base_url = '', csrf_url = '', login_url = '', logout_url = '') {
        const router = new Router()
        router.baseURL(base_url, csrf_url, login_url, logout_url)
        router.api_name = name
        this.apis[name] = router
        return router
    }

    axiosClient(client) {
        this.client = client
        return this
    }

    getApi(name) {
        if (!this.apis[name]) {
            throw `API with name ${name} is not defined, add your API to the Router class.`;
        }
        return this.apis[name]
    }
}

module.exports = new Router()
