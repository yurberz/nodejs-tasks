const express = require('express')
const router = express.Router()
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../model/index')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts()

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
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params

    const contact = await getContactById(contactId)

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
})

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body

    if (!name || !email || !phone) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        data: { message: 'missing required name field' },
      })
    } else {
      const contact = await addContact(req.body)

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
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId)

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
})

router.patch('/:contactId', async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        data: { message: 'missing fields' },
      })
    }

    const contact = await updateContact(req.params.contactId, req.body)

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
  } catch (err) {
    next(err)
  }
})

module.exports = router
