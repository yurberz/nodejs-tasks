const express = require('express')
const router = express.Router()
const contactsController = require('../../controllers/contactsController')
const validate = require('../../utils/validationContact')

router.get('/', contactsController.getListContacts)

router.get('/:contactId', contactsController.getContactByID)

router.post('/', validate.createContact, contactsController.addContact)

router.delete('/:contactId', contactsController.removeContact)

router.patch('/:contactId', validate.updateContact, contactsController.updateContact)

module.exports = router
