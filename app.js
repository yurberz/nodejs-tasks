const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const swaggerUI = require('swagger-ui-express')
require('dotenv').config()
const router = require('./routes/router')
const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users')
const swaggerApiDocs = require('./swagger.json')

const app = express()
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
const IMG_DIR = process.env.IMG_DIR

app.use(express.static(path.join(__dirname, IMG_DIR)))
app.use(express.json())
app.use(logger(formatsLogger))
app.use(cors())

app.use(router)
app.use('/api/contacts', contactsRouter)
app.use('/api/users', usersRouter)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerApiDocs))

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
