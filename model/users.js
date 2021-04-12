const User = require('./schemas/user')

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const findById = async (id) => {
  return await User.findOne({ _id: id })
}

const create = async ({ email, password, verifyToken }) => {
  const user = new User({ email, password, verifyToken })

  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateSubscription = async (id, sub) => {
  return await User.updateOne({ _id: id }, { subscription: sub })
}

const updateAvatar = async (id, url) => {
  return await User.updateOne({ _id: id }, { avatarURL: url })
}

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken })
}

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.findByIdAndUpdate(id, { verify, verifyToken })
}

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateSubscription,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
}
