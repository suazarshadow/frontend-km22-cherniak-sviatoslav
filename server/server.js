const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); 
const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const matchesRouter = require("./routes/matches");
const userData = require("./routes/user")
const playerData = require("./routes/players")
const groupRoutes = require("./routes/groups");



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); 
 
app.use("/api", authRoutes);
app.use("/api", teamRoutes); 
app.use("/api", matchesRouter);
app.use("/api", userData);
app.use("/api", playerData);
app.use("/api/groups", groupRoutes);



const db = require("./db");
const { hashPassword } = require("./utils/hash");

async function createTestUser() {
  try {
    const res = await db.query("SELECT * FROM users WHERE username = $1", ["admin"]);
    
    if (res.rows.length === 0) {
      const hash = await hashPassword("1234");
      await db.query(
        "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)",
        ["admin", hash, "admin"]
      );
      console.log("🔐 Створено тестового користувача: admin / 1234");
    }
  } catch (error) {
    console.error("Помилка при створенні тестового користувача:", error);
  }
}

createTestUser();

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userRes = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = userRes.rows[0];

    if (!user) return res.status(401).json({ error: "Користувача не знайдено" });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: "Невірний пароль" });

    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    console.error("Помилка входу:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.urlencoded({ extended: true }));

app.listen(3001, () => {
  console.log("API сервер запущено на http://localhost:3001");
});