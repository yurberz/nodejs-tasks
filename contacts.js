const fs = require("fs/promises");
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

const readFile = async (contactsPath) => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data.toString());
  } catch (err) {
    console.error(err.message);
  }
};

const writeFile = async (contactsPath, data) => {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(data, null, "  "));
  } catch (err) {
    console.error(err.message);
  }
};

//

const listContacts = async () => {
  const data = await readFile(contactsPath);
  console.table(data);
};

const getContactById = async (contactId) => {
  const data = await readFile(contactsPath);

  const contactById = data.find((item) => item.id === contactId);

  console.table(contactById);
};

const removeContact = async (contactId) => {
  const data = await readFile(contactsPath);

  const contact = data.filter((item) => item.id !== contactId);

  await writeFile(contactsPath, contact);

  console.table(contact);
};

const addContact = async (name, email, phone) => {
  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  };

  const data = await readFile(contactsPath);

  data.push(newContact);

  await writeFile(contactsPath, data);

  console.table(data);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
