const fs = require('fs/promises')
const path = require('path')
const shortid = require('shortid')

const contactsPath = path.join(__dirname, './contacts.json')

const listContacts = async () => {
  const data = await fs.readFile(contactsPath)

  return JSON.parse(data)
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()

  const contactById = contacts.find(({ id }) => id.toString() === contactId)

  return contactById
}

const addContact = async (body) => {
  const contacts = await listContacts()

  const newContact = { id: shortid(), ...body }

  const newContacts = [...contacts, newContact]

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, ' '))

  return newContact
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()

  const contact = contacts.find(({ id }) => id.toString() === contactId)

  if (!contact) return

  const newContacts = await contacts.filter(
    ({ id }) => id.toString() !== contactId
  )

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, ' '))

  return contact
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()

  const contact = contacts.find(({ id }) => id.toString() === contactId)

  if (!contact) return

  const updateContact = { ...contact, ...body }

  const updateContactsList = contacts.map((item) =>
    item.id.toString() === contact.id.toString() ? updateContact : item
  )

  await fs.writeFile(
    contactsPath,
    JSON.stringify(updateContactsList, null, ' ')
  )

  return updateContact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
