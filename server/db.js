const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://weather_user:password@localhost/frontendreborn"
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Помилка підключення до PostgreSQL:', err);
  } else {
    console.log('Підключено до PostgreSQL:', res.rows[0].now);
  }
});

module.exports = pool;