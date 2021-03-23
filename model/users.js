const User = require('./schemas/user')

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const findById = async (id) => {
  return await User.findOne({ _id: id })
}

const create = async ({ email, password, name, sex }) => {
  const user = new User({ email, password, name, sex })

  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateSubscription = async (id, sub) => {
  return await User.updateOne({ _id: id }, { subscription: sub })
}

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateSubscription,
}
