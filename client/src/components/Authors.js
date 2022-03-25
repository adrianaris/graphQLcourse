import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BIRTH, AUTHORS_AND_BOOKS } from './queries'

const Authors = (props) => {
  const [author, setAuthor] = useState('')
  const [bornTo, setBornTo] = useState('')
  const [ editBirth ] = useMutation(EDIT_BIRTH, {
    refetchQueries: [ { query: AUTHORS_AND_BOOKS } ]
  })

  console.log(bornTo)

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const select = value => {
    setAuthor(value)
    setBornTo(authors.find(a => a.name === value).born)
  }

  const submit = (event) => {
    event.preventDefault()

    editBirth({ variables: { bornTo }}) 
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select
            value={author}
            onChange={({ target }) => select(target.value)}
            style={{ width: "30%"}}
          >
            {authors?.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        born <input
          type='text'
          value={bornTo ? bornTo : ''}
          onChange={({ target }) => setBornTo(parseInt(target.value))}
        />
        <div><button type='submit'>change birthyear</button></div>
      </form>
    </div>
  )
}

export default Authors
