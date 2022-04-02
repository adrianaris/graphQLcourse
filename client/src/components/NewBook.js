import { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/client'
import { ADD_BOOK, AUTHORS_AND_BOOKS, BOOK_ADDED } from './queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [ createBook ] = useMutation(ADD_BOOK, {
    refetchQueries: [ { query: AUTHORS_AND_BOOKS }]
  })

  //useSubscription(BOOK_ADDED, {
  //  onSubscriptionData: ({ subscriptionData }) => {
  //    console.log(subscriptionData)
  //  }
  //})

  if (!props.show) {
    return null
  }


  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: {
      title,
      author,
      published,
      genres
    } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
