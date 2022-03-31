import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient } from '@apollo/client'
import { AUTHORS_AND_BOOKS } from './components/queries'
import LoginForm from './components/LoginForm'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const result = useQuery(AUTHORS_AND_BOOKS)
  console.log(result)
  const client = useApolloClient()

  if (result.loading) {
    return <div>loading...</div>
  } else if (result.error) {
    return <div>error</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token &&
          <button onClick={() => setPage('login')}>login</button>
        }
        {token &&
          <><button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button></>
        }
      </div>

      <Authors show={page === 'authors'} authors={result.data.allAuthors} />

      <Books show={page === 'books'} books={result.data.allBooks} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} />
    </div>
  )
}

export default App
