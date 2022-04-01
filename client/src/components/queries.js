import { gql } from '@apollo/client'

export const AUTHORS_AND_BOOKS = gql`
  query Query($genre: String, $author: String) {
    allAuthors {
      name
      born
      bookCount
    }
    allBooks(genre: $genre, author: $author) {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
    }
    allGenres
  }
`
export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
      genres
    }
  }
`
export const EDIT_BIRTH = gql`
  mutation editAuthor($name: String!, $setBornTo: Int) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ALL_GENRES = gql`
  query Query {
    allGenres
  }
`
