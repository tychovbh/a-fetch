import React, {useState, useEffect} from 'react'
import Fetcher, {Router} from 'a-fetch'

Router.baseURL('http://localhost:8000')
    .csrfURL('/sanctum/csrf-cookie')
    .loginURL('/login')
    .logoutURL('/logout')
    .index('categories', '/api/categories')
    .show('category', '/api/categories/{id}')
    .store('category', '/api/categories')
    .update('category', '/api/categories/{id}')
    .delete('category', '/api/categories/{id}')

    .show('user', '/api/user')

function App() {
    const [categories, setCategories] = useState(Fetcher.collection())
    const [user, setUser] = useState(Fetcher.model())

    useEffect(() => {
        Fetcher.index('categories').then(response => setCategories(response))

        Fetcher.show('user').then(response => setUser(response))
    }, [])


    function destroy() {
        Fetcher.bearerToken('test').delete('category', {id: 1}).then(response => {
            console.log(response)
        })
    }

    function store() {
        Fetcher.store('category', {label: 'Dames', name: 'dames'}).then(response => {
            console.log(response)
        })
    }

    function login() {
        Fetcher.login({email: 'info@bespokeweb.nl'}).then(response => {
            window.location.reload()
        })
    }

    function logout() {
        Fetcher.logout().then(response => {
            window.location.reload()
        })
    }

    return <div>
        <button onClick={destroy}>delete</button>
        {!user.data.id && <button onClick={login}>login</button>}
        {Boolean(user.data.id) && <button onClick={logout}>logout</button>}
        <h1>User: {user.data.email}</h1>
        <ul style={{
            maxHeight: '150px',
            overflowY: 'scroll'
        }}>
            {
                categories.data.map((category, index) => <li key={index}>{category.name}</li>)
            }
        </ul>
        <button onClick={store}>store category</button>

    </div>
}

export default App
