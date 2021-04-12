const jwt = require('jsonwebtoken')
require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const Users = require('../model/users')
const { HttpCode, SUBSCRIPTIONS } = require('../utils/constants')
const sendMail = require('../utils/sendEmail')
const {
  downloadAvatarFromUrl,
  saveAvatarToStatic,
  deletePreviousAvatar,
} = require('../utils/create-avatar')

const SECRET_KEY = process.env.JWT_SECRET

const reg = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await Users.findByEmail(email)

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      })
    }

    const verifyToken = uuidv4()

    const newUser = await Users.create({ ...req.body, verifyToken })

    await sendMail(verifyToken, email)

    const { tmpPath, nameAvatar } = await downloadAvatarFromUrl(newUser)

    const avatarURL = await saveAvatarToStatic(newUser.id, tmpPath, nameAvatar)

    await Users.updateAvatar(newUser.id, avatarURL)

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Users.findByEmail(email)

    if (!user || !(await user.validPassword(password))) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Email or password is wrong',
      })
    }

    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Email is not verified',
      })
    }

    const id = user._id

    const subscription = user.subscription

    const payload = { id }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })

    await Users.updateToken(id, token)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: { email, subscription },
      },
    })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    const id = req.user.id

    await Users.updateToken(id, null)

    return res.status(HttpCode.NO_CONTENT).json({})
  } catch (err) {
    next(err)
  }
}

const getUserInfo = async (req, res, next) => {
  try {
    const { id, email, subscription } = req.user

    const user = await Users.findById(id)

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Not authorized',
      })
    }

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email,
        subscription,
      },
    })
  } catch (err) {
    next(err)
  }
}

const updateUserSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body

    const id = req.user.id

    if (!SUBSCRIPTIONS.includes(subscription)) {
      return res.status(
        HttpCode.BAD_REQUEST.json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          data: 'Bad request',
          message: 'Invalid credentials',
        })
      )
    }

    await Users.updateSubscription(id, subscription)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        subscription,
      },
    })
  } catch (err) {
    next(err)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const id = req.user.id

    const pathFile = req.file.path

    const fileName = `${Date.now()}-${req.file.originalname}`

    const newAvatarUrl = await saveAvatarToStatic(id, pathFile, fileName)

    await Users.updateAvatar(id, newAvatarUrl)

    await deletePreviousAvatar(req.user.avatarURL)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { newAvatarUrl },
    })
  } catch (err) {
    next(err)
  }
}

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verificationToken)

    if (user) {
      await Users.updateVerifyToken(user.id, true, null)
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful!',
      })
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found',
    })
  } catch (err) {
    next(err)
  }
}

const re = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'missing required field email',
      })
    }

    const user = await Users.findByEmail(email)

    if (user.verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Verification has already been passed',
      })
    }

    const verifyToken = user.verifyToken

    await sendMail(verifyToken, email)

    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Verification email sent',
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  reg,
  login,
  logout,
  getUserInfo,
  updateUserSubscription,
  updateAvatar,
  verify,
  re,
}
