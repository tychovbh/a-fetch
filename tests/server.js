const express = require('express')
let assert = require('assert')
const app = express()
const port = 3000
const Fetcher = require('a-fetch')
const Router = require('a-fetch').Router

Router.baseURL('https://jsonplaceholder.typicode.com')
    .index('todos', '/todos')
    .show('todos', '/todos/{id}')
    .store('todos', '/todos')
    .update('todos', '/todos/{id}')
    .delete('todos', '/todos/{id}')

Router.api('laravel-api', 'http://127.0.0.1:8000')
    .index('categories', '/api/categories')
    .show('categories', '/api/categories/{id}')
    .store('category', '/api/categories')
    .update('category', '/api/categories/{id}')
    .delete('category', '/api/categories/{id}')

app.get('/categories', (req, res) => {
    Fetcher.api('laravel-api').index('categories', {paginate: 5}, [{id: 1, name: 'kids', label: 'Kids'}]).then(response => {
        assert.strictEqual(response.loading, false)
        assert.strictEqual(response.data.length, 6)
        assert.strictEqual(response.meta.current_page, 1)
        assert.strictEqual(response.data[0].id, 1)
        assert.strictEqual(response.data[0].name, 'kids')
    })

    Fetcher.api('laravel-api').show('categories', {id: 3}).then(response => {
        assert.strictEqual(response.loading, false)
        assert.strictEqual(response.data.id, 3)
        assert.strictEqual(response.data.name, 'heren')
    })

    let category = {label: 'Dames'}
    Fetcher.api('laravel-api').store('category', category).then(response => {
        assert.strictEqual(response.loading, false)
        assert.deepStrictEqual(response.errors, [
            {
                field: 'name',
                message: 'Input field name is missing from the Request.'
            }
        ])
    })

    category = {label: 'Dames', name: 'dames'}
    Fetcher.api('laravel-api').store('category', category).then(response => {
        assert.strictEqual(response.loading, false)
        assert.strictEqual(response.data.id > 0, true)
        assert.strictEqual(response.data.name, 'dames')
        assert.strictEqual(response.data.label, 'Dames')
    })

    Fetcher.api('laravel-api').store('category', category, [{id: 1, name: 'kids', label: 'Kids'}]).then(response => {
        assert.strictEqual(response.loading, false)
        assert.strictEqual(response.data.length, 2)
        assert.strictEqual(response.data[0].id, 1)
        assert.strictEqual(response.data[0].name, 'kids')
    })

    category = {id: 3, label: 'Heren', name: 'heren'}
    Fetcher.api('laravel-api').update('category', category).then(response => {
        assert.strictEqual(response.loading, false)
        assert.strictEqual(response.data.id, 3)
        assert.strictEqual(response.data.name, 'heren')
        assert.strictEqual(response.data.label, 'Heren')
    })

    Fetcher.api('laravel-api').update('category', category, [{id: 3, name: 'kids', label: 'Kids'}]).then(response => {
        assert.strictEqual(response.loading, false)
        assert.strictEqual(response.data[0].id, 3)
        assert.strictEqual(response.data[0].name, 'heren')
        assert.strictEqual(response.data.length, 1)
    })

    Fetcher.api('laravel-api').delete('category', {id: 52}).then(response => {
        assert.strictEqual(response.loading, false)
        assert.strictEqual(response.deleted, true)
    })

    Fetcher.api('laravel-api').delete('category', {id: 53}, [{id: 53, name: 'kids', label: 'Kids'}]).then(response => {
        assert.strictEqual(response.data.length, 0)
        assert.strictEqual(response.loading, false)
    })

    res.send('All tests passed!')
})

app.get('/', (req, res) => {
    Fetcher.index('todos').then(response => {
        assert.strictEqual(response.data.length, 200, 'Cannot index')
    })

    Fetcher.index('todos', {id: 1}).then(response => {
        assert.strictEqual(response.data.length, 1)
        assert.strictEqual(response.data[0].id, 1, 'Cannot index with params')
    })

    Fetcher.show('todos', {id: 1}).then(response => {
        assert.strictEqual(response.data.id, 1, 'Cannot show')
    })

    let store = {title: 'delectus aut autem', completed: 'true'}
    Fetcher.store('todos', store).then(response => {
        assert.strictEqual(response.data.id, 201, 'Cannot store')
    })

    let update = {id: 1, title: 'delectus aut autem', completed: 'true'}
    Fetcher.update('todos', update).then(response => {
        assert.strictEqual(response.data.id, 1, 'Cannot update')
    })

    let todo = {id: 1}
    Fetcher.delete('todos', todo).then(response => {
        assert.strictEqual(!!response.data, true, 'Cannot delete')
    })


    res.send('All tests passed!')
})

app.listen(port, () => console.log(`Example app listening on port http://localhost${port}!`))
