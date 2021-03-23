const { Schema, SchemaTypes, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name contact is required'],
    },
    email: {
      type: String,
      required: [true, 'Email contact is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone contact is required'],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

contactSchema.plugin(mongoosePaginate)

const Contact = model('contact', contactSchema)

module.exports = Contact
