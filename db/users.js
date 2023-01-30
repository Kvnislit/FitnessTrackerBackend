const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  `CREATE TABLE users (
    id SERIAL PRIMARY KEY 
    username VARCHAR(255) UNIQUE NOT NULL
    password VARCHAR(255) NOT NULL
  )
  `
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
}

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
