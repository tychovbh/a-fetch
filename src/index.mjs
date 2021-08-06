class Fetcher {
    static doSomething() {
        console.log('Fetch')
    }
}

Fetcher.Request = require('./Request')
module.exports = Fetcher

