class Fetcher {
    static doSomething() {
        console.log('Fetch')
    }
}

export {default as Request} from './Request.mjs'
export default Fetcher
// Fetcher.Request = require('./Request')
// module.exports = Fetcher

