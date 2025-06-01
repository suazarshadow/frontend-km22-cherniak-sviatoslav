const db = require('../db'); 


async function findUserByUsername(username) {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Помилка при пошуку користувача:", err);
    throw err;
  } 
}


async function createUser(username, passwordHash) {
  try {
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, passwordHash]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Помилка при створенні користувача:", err);
    throw err;
  }
}

module.exports = {
  findUserByUsername,
  createUser,
};