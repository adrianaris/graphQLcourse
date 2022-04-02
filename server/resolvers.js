const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { JWT_SECRET } = require('./utils/config')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      let filtered = author
        ? await Book.find({ author: { $exists: true, $in: [author._id] } })
            .populate('author')
        : await Book.find({})
            .populate('author')
      filtered = args.genre
        ? filtered.filter(b => b.genres.includes(args.genre))
        : filtered

      filtered = await filtered.map(async b => {
        b.author.bookCount = b.author.books.length
        return b
      })
      return filtered
    },
    allAuthors: async () => {
      let authors = await Author.find({})
      authors = await authors.map(async a => {
        a.bookCount = a.books.length
        return a
      })
      return authors
    },

    allGenres: async () => {
      const books = await Book.find({})
      const genres = [ ...new Set(books.reduce((p, c) => p.concat(c.genres), []))]
      console.log(genres)
      return genres
    },

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      let exists = await Book.exists({ title: args.title })
      if (exists) {
        throw new UserInputError('Book must be unique', {
          invalidArgs: args.title,
        })
      }
      exists = await Author.findOne({ name: args.author })
      if (!exists) {
        var author = new Author({ name: args.author })
        try {
          exists =  await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args.author,
          })
        }
      }

      let book = new Book({ ...args, author: exists._id })

      try {
        exists = await book.save()
        await book.populate('author')
        author.books = author.books.concat(exists._id)
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      book.author.bookCount = book.author.books.length

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      } else {
        author.born = args.setBornTo ? args.setBornTo : null
        await author.save()
        author.bookCount = author.books.length
        return author
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== 'parola') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers
