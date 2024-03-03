const faker = require('faker');
let temp = []
const generateAuthorData = () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName);
    const password = faker.internet.password();

    return {
        firstName,
        lastName,
        email,
        password
    };
};

const generateUserData = () => {
    const name = faker.name.firstName()
    const email = faker.internet.email(name);
    const password = faker.internet.password();
    const username = name
    return {
        name,
        email,
        password,
        username
    }
}
const generatebookData = () => {
    const title = faker.name.title();
    const author = "65dc94e389d22b1cea69e48d" // or any id
    const description = faker.lorem.paragraph();
    const price = faker.commerce.price();
    const cover = "cover"
    return {
        title,
        author,
        description,
        price,
        cover,
    }
}

const AuthorData = () => {
    temp = []
    for (let i = 0; i < 10; i++) {
        temp.push(generateAuthorData())
    }
    return temp;
}

const userData = () => {
    temp = []
    for (let i = 0; i < 10; i++) {
        temp.push(generateUserData())
    }
    return temp
}
const bookData = () => {
    temp = []
    for (let i = 0; i < 10; i++) {
        temp.push(generatebookData())
    }
    return temp
}



module.exports = { userData, AuthorData, bookData }
// Usage example


