const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/usersController')
const validate = require('../../utils/validations/validationUser')
const guard = require('../../utils/guard')

router.post('/auth/register', validate.reg, usersController.reg)

router.post('/auth/login', validate.login, usersController.login)

router.post('/auth/logout', guard, usersController.logout)

router.get('/current', guard, usersController.getUserInfo)

router.patch('/', guard, usersController.updateUserSubscription)

module.exports = router
