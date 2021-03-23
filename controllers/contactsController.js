const Contacts = require('../model/contacts')
const { HttpCode } = require('../utils/constants')

const getListContacts = async (req, res, next) => {
  try {
    const userId = req.user.id

    const contacts = await Contacts.listContacts(userId, req.query)

    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        ...contacts,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getContactByID = async (req, res, next) => {
  try {
    const { contactId } = req.params

    const userId = req.user.id

    const contact = await Contacts.getContactById(contactId, userId)

    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
    }
  } catch (err) {
    next(err)
  }
}

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id

    const contact = await Contacts.addContact({ ...req.body, owner: userId })

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        contact,
      },
    })
  } catch (err) {
    next(err)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params

    const userId = req.user.id

    const contact = await Contacts.removeContact(contactId, userId)

    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Contact deleted' },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
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

    const userId = req.user.id

    const contact = await Contacts.updateContact(req.body, contactId, userId)

    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
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
