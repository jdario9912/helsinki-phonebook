import Contact from "../schemas/contact";

export const info = async () => {
  const contacts = await Contact.find({});

  return `
    <p>Phonebook has info for ${contacts.length} people</p>
    <br/>
    <p>${new Date().getDate()} ${
    new Date().getMonth() + 1
  } ${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}</p>
`;
};
