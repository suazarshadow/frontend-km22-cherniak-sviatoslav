const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/matches", async (req, res) => {
  const { teamA, teamB, scoreA, scoreB, date, status } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO matches (team_a_id, team_b_id, score_a, score_b, date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [teamA, teamB, scoreA, scoreB, date, status]
    );

    if (status === "Завершено") {
      const scoreAInt = parseInt(scoreA);
      const scoreBInt = parseInt(scoreB);

      await db.query(`
        UPDATE teams
        SET sets_played = sets_played + $1,
            sets_won = sets_won + $2
        WHERE id = $3
      `, [scoreAInt + scoreBInt, scoreAInt, teamA]);

      await db.query(`
        UPDATE teams
        SET sets_played = sets_played + $1,
            sets_won = sets_won + $2
        WHERE id = $3
      `, [scoreAInt + scoreBInt, scoreBInt, teamB]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Помилка створення матчу:", error);
    res.status(500).json({ error: "Серверна помилка" });
  }
});

router.put("/matches/:id", async (req, res) => {
  const { id } = req.params;
  const { score_a, score_b, status } = req.body;

  try {
    await db.query(`
      UPDATE matches
      SET score_a = $1,
          score_b = $2,
          status = $3
      WHERE id = $4
    `, [score_a, score_b, status, id]);

    res.json({ success: true });
  } catch (err) {
    console.error("Помилка при оновленні матчу:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.get("/matches", async (req, res) =>{
  try{
      const matchesschedule = await db.query(`
      SELECT 
        m.id,
        m.date,
        m.location,
        m.score_a,
        m.score_b,
        m.status,
        ta.name AS team_a_name,
        tb.name AS team_b_name
      FROM matches m
      JOIN teams ta ON m.team_a_id = ta.id
      JOIN teams tb ON m.team_b_id = tb.id
    `);
    console.log(matchesschedule.rows);
    res.json(matchesschedule.rows);
  }catch{
    res.status(500).json({ error: "Помилка сервера" });
  };
});

module.exports = router;
