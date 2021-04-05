const fs = require('fs/promises')
const path = require('path')
const fetch = require('node-fetch')
const fileType = require('file-type')
const Jimp = require('jimp')
const createFolderIsExist = require('./create-dir')
require('dotenv').config()

const UPLOAD_DIR = process.env.UPLOAD_DIR
const images = 'images'
const IMG_DIR = path.join(process.env.IMG_DIR, images)

const downloadAvatarFromUrl = async (user) => {
  const avatarURL = user.avatarURL

  const downloadedAvatar = await fetch(avatarURL)

  const downloadedAvatarBuffer = await downloadedAvatar.buffer()

  const type = await fileType(downloadedAvatarBuffer)

  const nameAvatar = `${user.id}.${type.ext}`

  const tmpPath = path.join(UPLOAD_DIR, nameAvatar)

  await fs.writeFile(tmpPath, downloadedAvatarBuffer)

  return { tmpPath, nameAvatar }
}

const saveAvatarToStatic = async (userId, pathFile, nameAvatar) => {
  const img = await Jimp.read(pathFile)

  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)

  await createFolderIsExist(path.join(IMG_DIR))

  await fs.rename(pathFile, path.join(IMG_DIR, nameAvatar))

  const newAvatarURL = path.normalize(path.join(nameAvatar))

  return newAvatarURL
}

const deletePreviousAvatar = async (prevAvatar) => {
  try {
    await fs.unlink(path.join(process.cwd(), IMG_DIR, prevAvatar))
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  downloadAvatarFromUrl,
  saveAvatarToStatic,
  deletePreviousAvatar,
}
