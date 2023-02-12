/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require("bcrypt");


const SALT_COUNT = 10;

// user functions
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  
  const { rows: [user] } = await client.query(`
  INSERT INTO users (username, password) 
  VALUES ($1, $2) 
  RETURNING id, username
  `,  [username, hashedPassword]
  );
  
  return user;
  }

async function getUser({ username, password }) {
  try{
    const user = await getUserByUsername(username)
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword)
  if(isValid){
  delete user.password;
  return user;
  }
}
catch(error){
  throw error;
}
}

async function getUserById(userId) {
 try {
  const {rows} = await client.query(`
   SELECT id, username 
   FROM users
   WHERE id = $1
  `,[userId] );
  return rows[0];

 }catch(error){
  throw error;
 }
}

async function getUserByUsername(userName) {
  const { rows } = await client.query(`
  SELECT * FROM users WHERE username = $1`,
    [userName]
    );
    return rows [0]
  }

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}