import { gql } from '@apollo/client'

export const AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`
export const BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
      genres
      id
    }
  }
`
