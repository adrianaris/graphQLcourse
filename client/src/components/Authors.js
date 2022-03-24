import { useState } from 'react'

const Authors = (props) => {
  const [author, setAuthor] = useState('')
  if (!props.show) {
    return null
  }
  const authors = props.authors
  console.log(authors)

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
      <form onSubmit={console.log('test')}>
        <select value={author} onChange={({ target }) => setAuthor(target.value)}>
          {authors?.map(a => (
            <option key={a.name} value={a.born}>{a.name}</option>
          ))}
        </select>
        born <input type='text' value={author} />
      </form>
    </div>
  )
}

export default Authors
