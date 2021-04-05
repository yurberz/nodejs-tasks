const app = require('../app')
const db = require('../model/db')
const createFolderIsExist = require('../utils/create-dir')
require('dotenv').config()

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOAD_DIR = process.env.UPLOAD_DIR
    const IMG_DIR = process.env.IMG_DIR

    await createFolderIsExist(UPLOAD_DIR)
    await createFolderIsExist(IMG_DIR)

    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch((err) => {
  console.log(`Server not running. Error message: ${err.message}`)
  process.exit(1)
})
