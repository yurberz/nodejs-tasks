const jwt = require('jsonwebtoken')
require('dotenv').config()
const Users = require('../model/users')
const { HttpCode, SUBSCRIPTIONS } = require('../utils/constants')

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

    const newUser = await Users.create(req.body)

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
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

module.exports = {
  reg,
  login,
  logout,
  getUserInfo,
  updateUserSubscription,
}
