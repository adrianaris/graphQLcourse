
const Books = (props) => {
  const books = props.books
  const genres = props.genres
  const genre = props.genre
  const setGenre = props.setGenre
  if (!props.show) {
     return null
  }

  return (
    <div>
      <h2>books</h2>
      {genre &&
        <div>in genre <b>{genre}</b></div>
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(g => (
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
