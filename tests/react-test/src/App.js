import React, {useState, useEffect} from 'react'
import Fetcher, {Router} from 'a-fetch'

Router.baseURL('http://localhost:8000')
    .csrfURL('/sanctum/csrf-cookie')
    .loginURL('/login')
    .logoutURL('/logout')
    .index('categories', '/api/categories')
    .show('categories', '/api/categories/{id}')
    .store('categories', '/api/categories', {
        form_data: true
    })
    .update('categories', '/api/categories/{id}')
    .delete('categories', '/api/categories/{id}')

    .show('user', '/api/user')

function App() {
    const [categories, setCategories] = useState(Fetcher.collection())
    const [user, setUser] = useState(Fetcher.model())
    const [category, setCategory] = useState(Fetcher.model())

    useEffect(() => {
        Fetcher.index('categories').then(response => setCategories(response))

        Fetcher.show('user').then(response => setUser(response))
    }, [])

    function destroy() {
        Fetcher.bearerToken('test').delete('categories', {id: 1}).then(response => {
            console.log(response)
        })
    }

    function store() {
        Fetcher.store('categories', {label: 'Dames', name: 'dames'}).then(response => {
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
            overflowY: 'scroll',
        }}>
            {
                categories.data.map((category, index) => <li key={index}>{category.name}</li>)
            }
        </ul>
        <button onClick={store}>store category</button>


        <form onSubmit={(event) => {
            event.preventDefault()
            Fetcher.store('categories', category).then(response => {
                console.log(response)
            })
        }}>
            <div>
                <h1>Store Category</h1>
                <label htmlFor={'name'}>Name</label>

                <input
                    type={'text'}
                    name={'name'}
                    id={'name'}
                    onChange={(value) => setCategory({...category, name: value.target.value})}
                    value={category.data.name}
                />
            </div>

            <div>
                <label htmlFor={'label'}>Label</label>

                <input
                    type={'text'}
                    name={'label'}
                    id={'label'}
                    onChange={(value) => setCategory({...category, label: value.target.value})}
                    value={category.data.label}
                />
            </div>
            <div>
                <input type="file" onChange={event => setCategory({...category, thumbnail: event.target.files[0]})}/>
            </div>
            <div>
                <input type={'submit'} name={'submit'} value={'create'}/>
            </div>
        </form>
    </div>
}

export default App
