const axios = require('axios')

const Client = axios.create({
    withCredentials: true
})

module.exports = Client
