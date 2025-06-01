const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/players", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM players");
    res.json(result.rows);
  } catch (err) {
    console.error("Помилка при отриманні гравців:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});


router.delete("/players/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM players WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Помилка при видаленні гравця:", err);
    res.status(500).json({ error: "Помилка при видаленні гравця" });
  }
});

module.exports = router;
