const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        g.id,
        g.name,
        t1.name AS team1_name,
        t2.name AS team2_name,
        t3.name AS team3_name,
        t4.name AS team4_name,
        COALESCE(t1.sets_won, 0) + COALESCE(t2.sets_won, 0) +
        COALESCE(t3.sets_won, 0) + COALESCE(t4.sets_won, 0) AS total_sets_won
      FROM groups g
      LEFT JOIN teams t1 ON g.team_1_id = t1.id
      LEFT JOIN teams t2 ON g.team_2_id = t2.id
      LEFT JOIN teams t3 ON g.team_3_id = t3.id
      LEFT JOIN teams t4 ON g.team_4_id = t4.id
      ORDER BY total_sets_won DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});


router.post("/", async (req, res) => {
  const { name, team_1_id, team_2_id, team_3_id, team_4_id } = req.body;


  const teamIds = [team_1_id, team_2_id, team_3_id, team_4_id].filter(Boolean);
  const unique = new Set(teamIds);
  if (teamIds.length !== unique.size) {
    return res.status(400).json({ error: "Команди у групі не можуть повторюватися" });
  }

  try {
   
    const check = await db.query(`
      SELECT * FROM groups
      WHERE team_1_id = ANY($1) OR team_2_id = ANY($1)
         OR team_3_id = ANY($1) OR team_4_id = ANY($1)
    `, [teamIds]);

    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Одна або більше команд вже належить до іншої групи" });
    }

    const result = await db.query(`
      INSERT INTO groups (name, team_1_id, team_2_id, team_3_id, team_4_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [name, team_1_id || null, team_2_id || null, team_3_id || null, team_4_id || null]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка створення групи" });
  }
});


router.put("/:id", async (req, res) => {
  const groupId = req.params.id;
  const { name, team_1_id, team_2_id, team_3_id, team_4_id } = req.body;

  const teamIds = [team_1_id, team_2_id, team_3_id, team_4_id].filter(Boolean);
  const unique = new Set(teamIds);
  if (teamIds.length !== unique.size) {
    return res.status(400).json({ error: "Команди у групі не можуть повторюватися" });
  }

  try {
    const check = await db.query(`
      SELECT * FROM groups
      WHERE id != $1 AND (
        team_1_id = ANY($2) OR team_2_id = ANY($2)
     OR team_3_id = ANY($2) OR team_4_id = ANY($2)
      )
    `, [groupId, teamIds]);

    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Одна або більше команд вже належить до іншої групи" });
    }

    const result = await db.query(`
      UPDATE groups
      SET name = $1, team_1_id = $2, team_2_id = $3, team_3_id = $4, team_4_id = $5
      WHERE id = $6
      RETURNING *;
    `, [name, team_1_id || null, team_2_id || null, team_3_id || null, team_4_id || null, groupId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при оновленні групи" });
  }
});

module.exports = router;
