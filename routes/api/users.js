const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/usersController')
const validateUser = require('../../utils/validations/validationUser')
const {
  validateUploadAvatar,
} = require('../../utils/validations/validationAvatar')
const guard = require('../../utils/guard')
const upload = require('../../utils/upload')

router.post('/auth/register', validateUser.reg, usersController.reg)

router.post('/auth/login', validateUser.login, usersController.login)

router.post('/auth/logout', guard, usersController.logout)

router.get('/current', guard, usersController.getUserInfo)

router.patch('/', guard, usersController.updateUserSubscription)

router.patch(
  '/avatars',
  [guard, upload.single('avatar'), validateUploadAvatar],
  usersController.updateAvatar
)

module.exports = router
