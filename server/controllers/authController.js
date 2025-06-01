const { findUserByUsername } = require("../models/userModel");
const { comparePassword } = require("../utils/hash");


async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);

  if (!user) {
    console.log("Невірний пароль або логін");
    return res.status(401).json({ error: "Користувача не знайдено" });
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    console.log("Невірний пароль або логін");
    return res.status(401).json({ error: "Невірний пароль" });
  }
  console.log("[INFO] user (admin) is logged in") 
  res.json({id: user.id, username: user.username, role: user.role });
}

module.exports = { loginUser };