import axios from 'axios'

const Client = axios.create({
    withCredentials: true
})

export default Client
