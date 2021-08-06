const Variables = require('./Variables')

class Response
{
    static empty(data, route, debug = false) {
        const message = `Route: ${route} not found`
        if (debug) {
            console.log('Request error', message)
        }

        return new Promise((resolve, reject) => {
            resolve({
                ...data,
                errors: [message],
            })
        })
    }

    static index(response) {
        let data_key = 'data'
        let data = {
            ...Variables.collection,
            loading: false
        }

        if (response[data_key]) {
            data = {...data, ...response}
            data[data_key] = response[data_key]
        } else {
            data[data_key] = response
        }

        return data
    }

    static show(response) {
        let data_key = 'data'
        let data = {
            ...Variables.model,
        }

        let record = response

        if (response[data_key]) {
            data = {...response}
            record = response[data_key]
        }

        return {
            ...data,
            [data_key]: record,
            loading: false,
        }
    }

    static model(response) {
        let data_key = 'data'
        let data = {...Variables.model}
        if (response[data_key]) {
            data = {...data, ...response}
        } else {
            data = {...data, [data_key]: response}
        }

        return {
            ...data,
            loading: false,
        }
    }

    static records(method, response, records, key) {
        let data_key = 'data'
        if (response[data_key]) {
            const value = method === 'delete' ? response[data_key][key] : response[data_key]
            records = records.clone()[method](value, key)
        } else {
            const value = method === 'delete' ? response[key] : response
            records = records.clone()[method](value, key)
        }


        return records
    }

    static errorCollection(errors) {
        return {
            ...Variables.collection,
            errors,
            loading: false,
        }
    }

    static errorModel(errors) {
        return {
            ...Variables.model,
            errors,
            loading: false,
        }
    }

    static errorMessages(response) {
        let errors = []
        for (let field in response.errors) {
            errors.push({
                field,
                message: response.errors[field][0],
            })
        }
        return errors
    }

    static errors(error) {
        const response = error.response ? error.response.data : error.response

        if (response.errors) {
            return Response.errorMessages(response)
        }

        if (!response) {
            return [{message: error}]
        }
        if (response.message) {
            return [{message: response.message}]
        }

        return response
    }
}

module.exports = Response
