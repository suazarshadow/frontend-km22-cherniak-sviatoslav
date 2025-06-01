import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import logo from "../img/logo.png";
import { getCurrentUser, logout } from "./auth";

const user = getCurrentUser();
export default function TeamPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/team/${id}`);
        if (!response.ok) throw new Error("Команду не знайдено");
        const data = await response.json();
        setTeam(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeam();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!team) return <div className="loading">Завантаження...</div>;

  return (
    <div className="main-wrapper">
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
                              <li><button onClick={() => { logout(); window.location.reload(); }}>Вийти</button></li>
                            </>
                          ) : (
                            <li><Link to="/login">Увійти</Link></li>
                          )}
                    </ul>
                  </nav>
              </div>
            </header>

      <main className="team-details">
        <div className="team-header">
          <Link to="/teams" className="back-button">← Назад</Link>
          <h1>{team.name}</h1>
          {team.logoUrl && (
            <img
              src={team.logoUrl}
              alt={`Логотип ${team.name}`}
              className="team-logo-large"
            />
          )}
        </div>

        <div className="team-info">
          <ul>
            <li><strong>Група:</strong> {team.group}</li>
            <li><strong>Виграні сети:</strong> {team.sets_won}</li>
            <li><strong>Програні сети:</strong> {team.sets_lost}</li>
          </ul>
        </div>

        <div className="players-section">
          <h2 className="centered-title">Склад команди</h2>
          {team.players.length === 0 ? (
            <p>Гравців ще не додано</p>
          ) : (
            <table className="volleyball-table">
              <thead>
                <tr>
                  <th>Ім'я</th>
                  <th>Позиція</th>
                  <th>Ріст (см)</th>
                </tr>
              </thead>
              <tbody>
                {team.players.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.position}</td>
                    <td>{p.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2025 ПолянаБол. Всі права захищені.</p>
        </div>
      </footer>
    </div>
  );
}
