const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/user", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Помилка при отриманні користувачів:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});


router.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Помилка при видаленні користувача:", err);
    res.status(500).json({ error: "Помилка при видаленні користувача" });
  }
});

module.exports = router;