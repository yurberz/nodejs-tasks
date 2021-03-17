const mongoose = require('mongoose')
require('dotenv').config()

const uriDb = process.env.URI_DB

const db = mongoose.connect(uriDb, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
  console.log('Database connection successful')
})

mongoose.connection.on('error', (err) => {
  console.log(`Database connection error: ${err.message}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected')
})

process.on('SIGINT', async () => {
  console.log('Connection for DB closed and app terminated')
  mongoose.connection.close(() => {
    process.exit(1)
  })
})

module.exports = db
