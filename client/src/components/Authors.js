import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BIRTH, AUTHORS_AND_BOOKS } from './queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setSetBornTo] = useState('')
  const [ editBirth ] = useMutation(EDIT_BIRTH, {
    refetchQueries: [ { query: AUTHORS_AND_BOOKS } ]
  })

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const select = value => {
    setName(value)
    setSetBornTo(authors.find(a => a.name === value).born)
  }

  const submit = (event) => {
    event.preventDefault()

    editBirth({ variables: {
      name,
      setBornTo 
    } }) 
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
            value={name}
            onChange={({ target }) => select(target.value)}
            style={{ width: "30%"}}
          >
            {authors?.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        born <input
          value={setBornTo ? setBornTo : ''}
          onChange={({ target }) => setSetBornTo(parseInt(target.value))}
        />
        <div><button type='submit'>change birthyear</button></div>
      </form>
    </div>
  )
}

export default Authors
