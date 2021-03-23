const Contact = require('./schemas/contact')

const listContacts = async (
  userId,
  { sub, page = '1', limit = '5', sortBy, sortByDesc }
) => {
  const query = sub ? { owner: userId, subscription: sub } : { owner: userId }

  const options = {
    page,
    limit,
    populate: {
      path: 'owner',
      select: 'email name sex -_id',
    },
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  }

  const result = await Contact.paginate(query, options)

  const { docs: contacts, totalDocs: total } = result

  return { contacts, total: total.toString(), page, limit }
}

const getContactById = async (contactId) => {
  const result = await Contact.findOne({ _id: contactId }).populate({
    path: 'owner',
    select: 'email name sex -_id',
  })

  return result
}

const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

const removeContact = async (contactId) => {
  const result = await Contact.findByIdAndRemove({ _id: contactId })
  return result
}

const updateContact = async (body, contactId) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  )
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
