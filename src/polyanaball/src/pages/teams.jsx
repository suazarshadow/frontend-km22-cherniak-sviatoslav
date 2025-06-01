import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from "./auth";
import logo from "../img/logo.png";

const Teams = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/loadteams");
        if (!response.ok) throw new Error("Помилка завантаження команд");
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        setError(err.message || "Помилка при отриманні даних");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="teams-list">
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src= {logo} alt="CВЛ Логотип" className="logo-img" />
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
                  <li><button onClick={handleLogout}>Вийти</button></li>
                </>
              ) : (
                <li><Link to="/login">Увійти</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Команди Ліги</h1>
          <p>Офіційна платформа волейбольної ліги України</p>
        </div>
      </section>

      <h2 className="centered-title">Усі команди</h2>

      {loading ? (
        <p className="loading-message">Завантаження команд...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="team-cards">
          {teams.map(team => (
            <li key={team.id} className="team-card">
              <Link to={`/team/${team.id}`} className="team-link">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={`Лого ${team.name}`} className="team-logo" />
                ) : (
                  <div className="no-logo">Без логотипу</div>
                )}
                <h3 className="team-name">{team.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Teams;