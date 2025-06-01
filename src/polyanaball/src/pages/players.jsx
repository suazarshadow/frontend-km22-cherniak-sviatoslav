import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import { getCurrentUser, logout } from "./auth";

export default function Players() {
  const user = getCurrentUser();
  const [players, setPlayers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filters, setFilters] = useState({ team: "all", position: "all" });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/players");
        if (!res.ok) throw new Error("Не вдалося отримати гравців");
        const data = await res.json();
        setPlayers(data);
        setFiltered(data)
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    let filteredData = players;

    if (filters.team !== "all") {
      filteredData = filteredData.filter(p => p.team === filters.team);
    }

    if (filters.position !== "all") {
      filteredData = filteredData.filter(p => p.position === filters.position);
    }

    setFiltered(filteredData);
  }, [filters, players]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="main-wrapper">
      <header>
        <div className="container">
          <div className="logo centered-logo">
            <Link to="/">
              <img src={logo} alt="CВЛ Логотип" className="logo-img" />
            </Link>
          </div>
          <nav>
            <ul>
              <li><Link to="/home">Головна</Link></li>
              <li><Link to="/teams">Команди</Link></li>
              <li><Link to="/group">Сітка</Link></li>
              <li><Link to="/players">Гравці</Link></li>
              {user ? (
                <>
                  <li><Link to={user.role === "admin" ? "/admin" : "/user"}>Мій кабінет</Link></li>
                  <li><button onClick={() => { logout(); window.location.reload(); }}>Вийти</button></li>
                </>
              ) : (
                <li><Link to="/login">Увійти</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <h2 className="centered-title">Гравці ліги</h2>

        <div className="filter-bar">
          <label htmlFor="team">Команда:</label>
          <label htmlFor="position">Позиція:</label>
          <select name="position" id="position" onChange={handleFilterChange} value={filters.position}>
            <option value="all">Всі</option>
            <option value="Догравальник">Догравальник</option>
            <option value="Ліберо">Ліберо</option>
            <option value="Центральний Блокуючий">Центральний Блокуючий</option>
            <option value="Зв’язуючий">Зв’язуючий</option>
          </select>
        </div>

        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="players-grid">
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center" }}>Гравців не знайдено</p>
            ) : (
              filtered.map(player => (
                <div className="player-card" key={player.id}>
                  <div className="player-name">{player.name}</div>
                  <div className="player-position">{player.team}</div>
                  <div className="player-position small-text">{player.position}</div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2025 ПолянаБол. Всі права захищені.</p>
        </div>
      </footer>
    </div>
  );
}
