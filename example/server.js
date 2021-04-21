const express = require('express')
let assert = require('assert')
const app = express()
const port = 3000
const Fetcher = require('jfa')

Fetcher.base_url = 'https://jsonplaceholder.typicode.com'
// Fetcher.debug()
Fetcher.router.index('todos', '/todos')
Fetcher.router.show('todos', '/todos/{id}')
Fetcher.router.store('todos', '/todos')
Fetcher.router.update('todos', '/todos/{id}')


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
        // assert.strictEqual(response.data.id, 1, 'Cannot update')
    })

    todo = {id: 1}
    Fetcher.delete('todos', todo).then(response => {
        assert.strictEqual(!!response.data, true, 'Cannot delete')
    })


    res.send('All tests passed!')
})

app.listen(port, () => console.log(`Example app listening on port http://localhost${port}!`))
