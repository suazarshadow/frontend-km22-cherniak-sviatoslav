const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");
const bcrypt = require("bcrypt");
const db = require("../db");


router.post("/register", async (req, res) => {
  try {
    const { username, password, team_id } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Необхідні логін і пароль" });
    }


    const userCheck = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: "Користувач вже існує" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const result = await db.query(
      `INSERT INTO users (username, password_hash, role, team_id) 
       VALUES ($1, $2, 'user', $3) RETURNING id`,
      [username, hashedPassword, team_id || null]
    );

    res.status(201).json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error("Помилка при реєстрації:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

module.exports = router;


router.post("/login", loginUser);

module.exports = router;