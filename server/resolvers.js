const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { JWT_SECRET } = require('./utils/config')

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
        b.author.bookCount = await Book.collection.countDocuments({ author: b.author._id })
        return b
      })
      return filtered
    },
    allAuthors: async () => {
      let authors = await Author.find({})
      authors = await authors.map(async a => {
        a.bookCount = await Book.collection.countDocuments({ author: a._id })
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
      if (!contex.currentUser) {
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
        let author = new Author({ name: args.author })
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
        await book.save()
        await book.populate('author')
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      book.author.bookCount = await Book.collection.countDocuments({ author: exists._id })
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
        author.bookCount = await Book.collection.countDocuments({ author: author._id })
        console.log(author)
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
  }
}

module.exports = resolvers
