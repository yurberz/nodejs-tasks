const { HttpCode } = require('../constants')

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad Request',
      message: 'Avatar field with file not found',
    })
  }
  next()
}
