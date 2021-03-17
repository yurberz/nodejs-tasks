const Contacts = require('../model/index')

const getListContacts = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()

    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getContactByID = async (req, res, next) => {
  try {
    const { contactId } = req.params

    const contact = await Contacts.getContactById(contactId)

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (err) {
    next(err)
  }
}

const addContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body

    if (!name || !email || !phone) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing required name field',
      })
    } else {
      const contact = await Contacts.addContact(req.body)

      return res.status(201).json({
        status: 'success',
        code: 201,
        data: {
          contact,
        },
      })
    }
  } catch (err) {
    next(err)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params

    const contact = await Contacts.removeContact(contactId)

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: { message: 'contact deleted' },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (err) {
    next(err)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params

    const contact = await Contacts.updateContact(req.body, contactId)

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        data: { message: 'missing fields' },
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getListContacts,
  getContactByID,
  addContact,
  removeContact,
  updateContact,
}
