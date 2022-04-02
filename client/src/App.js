import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { AUTHORS_AND_BOOKS, BOOK_ADDED } from './components/queries'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = a => {
    let seen = new Set()
    return a.filter(item => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  console.log(cache.readQuery(query))

  cache.updateQuery(query, (data) => {
    return {
      ...data,
      allBooks: uniqByName(data.allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('graphQL-token'))
  const [genre, setGenre] = useState(null)

  const result = useQuery(AUTHORS_AND_BOOKS, {
    variables: { genre }
  })
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData, client }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: AUTHORS_AND_BOOKS, variables: { genre } }, addedBook)
    }
  })

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
  const genreFilter = value => {
    setGenre(value)
    result.refetch({ genre : value })
  }
  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
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

      <Books 
        show={page === 'books'}
        books={result.data.allBooks}
        genres={result.data.allGenres}
        genre={genre}
        setGenre={genreFilter}
      />

      <NewBook show={page === 'add'} variables={{genre}} />

      <LoginForm show={page === 'login'} setToken={setToken} />
    </div>
  )
}

export default App
