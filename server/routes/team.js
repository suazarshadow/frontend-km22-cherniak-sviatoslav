const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const playerFields = Array.from({ length: 20 }, (_, i) => 
  ({ name: `players[${i}][photo]` })
);

router.post("/create-team", upload.fields([
  { name: "teamLogo", maxCount: 1 },
  ...playerFields
]), async (req, res) => {
  try {
    const { teamName } = req.body;
    const logoFile = req.files["teamLogo"]?.[0];
    const logoBuffer = logoFile ? fs.readFileSync(logoFile.path) : null;

    const teamRes = await db.query(
      `INSERT INTO teams (name, status, sets_won, sets_played, logo) 
       VALUES ($1, 'pending', 0, 0, $2) RETURNING id`,
      [teamName, logoBuffer]
    );
    const teamId = teamRes.rows[0].id;
    
    console.log(Object.keys(req.body));
    
    const { players } = req.body;

    for (const p of players) {
      console.log(p);
      await db.query(
        `INSERT INTO players (name, position, height, team_id)
        VALUES ($1, $2, $3, $4)`,
        [p.name, p.position, p.height, teamId]
      );
    }

    if (logoFile && fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
    players.forEach(p => {
      if (p.tempFilePath && fs.existsSync(p.tempFilePath)) {
        fs.unlinkSync(p.tempFilePath);
      }
    });

    res.json({ success: true, teamId });
  } catch (error) {
    console.error("Помилка при створенні команди:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.patch("/users/:id/team", async (req, res) => {
  const userId = req.params.id;
  const { teamId } = req.body;

  if (!userId || !teamId) {
    return res.status(400).json({ error: "Відсутній userId або teamId" });
  }

 
  const userIdNumber = parseInt(userId, 10);
  const teamIdNumber = parseInt(teamId, 10);

  if (isNaN(userIdNumber) || isNaN(teamIdNumber)) {
    return res.status(400).json({ error: "Невірний формат ID" });
  }

  try {
    await db.query(`UPDATE users SET team_id = $1 WHERE id = $2`, [
      teamIdNumber, 
      userIdNumber
    ]);
    res.json({ success: true , teamId: teamId});
  } catch (err) {
    console.error("Помилка оновлення користувача:", err);
    res.status(500).json({ error: "Серверна помилка" });
  }
});

router.get("/users/:id/isthereateam", async (req, res) => { 
  const userId = req.params.id;

  try{
    const result = await db.query(`
      SELECT teams.* FROM users
      JOIN teams ON users.team_id = teams.id
      WHERE users.id = $1
    `, [userId]);
    if (result.rows[0].id > 0){
      console.log(result.rows[0].id);
      return res.json({success: true, teamId: result.rows[0].id});
    }
    return res.json({teamId: 0});
    
    }catch(err){
      console.error("Помилка на стороні сервера у перевірці команди: ", err);
      res.status(500).json({err: 'Помилка оброобки запиту'})
    }

});
router.get("/loadteams", async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, logo FROM teams');

    const teams = result.rows.map(team => {
      let logoBase64 = null;

      if (team.logo) {
        const base64 = Buffer.from(team.logo).toString('base64');
        logoBase64 = `data:image/png;base64,${base64}`;
      }

      return {
        id: team.id,
        name: team.name,
        logoUrl: logoBase64, 
      };
    });

    res.json(teams);
  } catch (error) {
    console.error("Помилка завантаження команд:", error);
    res.status(500).json({ error: "Серверна помилка" });
  }
});
router.delete("/deleteteams/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM teams WHERE id = $1", [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Помилка при видаленні команди:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
router.get("/team/:id", async (req, res) => {
  const teamId = parseInt(req.params.id, 10);

  if (isNaN(teamId)) {
    return res.status(400).json({ error: "Невірний формат ID" });
  }

  try {
   
    const teamQuery = await db.query(`
      SELECT id, name, sets_won, sets_played, logo
      FROM teams
      WHERE id = $1
    `, [teamId]);

    if (teamQuery.rows.length === 0) {
      return res.status(404).json({ error: "Команду не знайдено" });
    }

    const team = teamQuery.rows[0];

    
    const groupQuery = await db.query(`
      SELECT name FROM groups
      WHERE team_1_id = $1 OR team_2_id = $1 OR team_3_id = $1 OR team_4_id = $1
    `, [teamId]);

    const groupName = groupQuery.rows.length > 0 ? groupQuery.rows[0].name : "Без групи";

    
    const playersQuery = await db.query(`
      SELECT id, name, position, height
      FROM players
      WHERE team_id = $1
    `, [teamId]);

   
    const logoBase64 = team.logo 
      ? `data:image/png;base64,${Buffer.from(team.logo).toString("base64")}`
      : null;

    res.json({
      id: team.id,
      name: team.name,
      sets_won: team.sets_won,
      sets_lost: team.sets_lost,
      sets_played: team.sets_played,
      logoUrl: logoBase64,
      group: groupName,
      players: playersQuery.rows
    });

  } catch (err) {
    console.error("Помилка отримання команди:", err);
    res.status(500).json({ error: "Серверна помилка" });
  }
});
module.exports = router;