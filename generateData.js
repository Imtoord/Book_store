const faker = require("faker");
let temp = [];

const generateAuthorData = () => {
  const generateFakeUser = () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const bio = faker.lorem.sentence();
    const password = faker.internet.password();
    const email = faker.internet.email();
    const image = {
      data: faker.random.words(), // Dummy data for image
      contentType: "image/jpeg", // You can modify this according to your needs
    };
    const access_token = faker.random.uuid();

    return {
      firstName,
      lastName,
      bio,
      password,
      email,
      image,
      access_token,
    };
  };

  const authorData = [];
  for (let i = 0; i < 10; i++) {
    authorData.push(generateFakeUser());
  }
  return authorData;
};

const generateUserData = () => {
  const name = faker.name.firstName();
  const email = faker.internet.email(name);
  const password = faker.internet.password();
  const username = name;
  return {
    name,
    email,
    password,
    username,
  };
};

const generateBookData = () => {
  const title = faker.lorem.words(); // Generate a random title
  const author = "65dc94e389d22b1cea69e48d"; // or any id
  const description = faker.lorem.paragraph();
  const price = faker.commerce.price();
  const cover = "cover";
  return {
    title,
    author,
    description,
    price,
    cover,
  };
};

const AuthorData = () => {
  temp = [];
  for (let i = 0; i < 10; i++) {
    temp.push(generateAuthorData());
  }
  return temp;
};

const userData = () => {
  temp = [];
  for (let i = 0; i < 10; i++) {
    temp.push(generateUserData());
  }
  return temp;
};

const bookData = () => {
  temp = [];
  for (let i = 0; i < 10; i++) {
    temp.push(generateBookData());
  }
  return temp;
};

module.exports = { userData, AuthorData, bookData };
