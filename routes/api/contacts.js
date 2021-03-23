const express = require('express')
const router = express.Router()
const contactsController = require('../../controllers/contactsController')
const validate = require('../../utils/validations/validationContact')
const guard = require('../../utils/guard')

router.get('/', guard, contactsController.getListContacts)

router.get('/:contactId', guard, contactsController.getContactByID)

router.post('/', guard, validate.createContact, contactsController.addContact)

router.delete('/:contactId', guard, contactsController.removeContact)

router.patch(
  '/:contactId',
  guard,
  validate.updateContact,
  contactsController.updateContact
)

module.exports = router
