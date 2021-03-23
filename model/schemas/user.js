const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')
const { Sex } = require('../../utils/constants')

const SALT_WORK_FACTOR = 6

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/
        return re.test(String(value).toLowerCase())
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    name: {
      type: String,
      minlength: 3,
      default: 'Guest',
    },
    sex: {
      type: String,
      enum: [Sex.MALE, Sex.FEMALE, Sex.NONE],
      default: Sex.NONE,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)

  this.password = await bcrypt.hash(this.password, salt, null)

  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
