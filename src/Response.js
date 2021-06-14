const variables = require('./variables')

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

    static index(response, records) {
        let data_key = 'data'
        let data = {
            ...variables.collection,
        }

        if (response[data_key]) {
            data = {...data, ...response}
            records = records.clone().concat(response[data_key])
        } else {
            records = records.clone().concat(response)
        }

        return {
            ...data,
            [data_key]: records,
            loading: false,
        }
    }

    static show(response) {
        let data_key = 'data'
        let data = {
            ...variables.model,
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
        let data = {...variables.model}
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

    static errorCollection(errors, records) {
        return {
            ...variables.collection,
            data: records,
            errors,
            loading: false,
        }
    }

    static errorModel(errors) {
        return {
            ...variables.model,
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
        if (!response) {
            return error
        }
        if (response.message) {
            return response.message
        }

        if (response.errors) {
            return Response.errorMessages(response)
        }

        return response
    }
}

module.exports = Response
