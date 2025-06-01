import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";


 

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/matches")
      .then(res => {
        if (!res.ok) throw new Error("Не вдалося завантажити матчі");
        return res.json();
      })
      .then(data => setMatches(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="main-wrapper">
       <header>
          <div className="container">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Логотип" className="logo-img" />
              </Link>
            </div>
            <nav>
              <ul>
                <li><Link to="/home">Головна</Link></li>
                <li><Link to="/teams">Команди</Link></li>
                <li><Link to="/group">Сітка</Link></li>
                <li><Link to="/players">Гравці</Link></li>
                <li><Link to="/login">Увійти</Link></li>
              </ul>
            </nav>
          </div>
        </header>
      <main className="matches-centered">
        <h2 className="centered-title">Усі матчі</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : matches.length === 0 ? (
          <p className="loading">Завантаження матчів...</p>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => (
              <div className="match-card" key={match.id}>
                <div className="match-teams">
                  <span>{match.team_a_name}</span>
                  <span className="vs">vs</span>
                  <span>{match.team_b_name}</span>
                </div>
                <div className="match-score">
                  <div className="set">{match.score_a ?? "-"}</div>
                  <div className="set">{match.score_b ?? "-"}</div>
                </div>
                <div className="match-details">
                  <div>{new Date(match.date).toLocaleDateString()}</div>
                  <div>{match.location || "Невідомо"}</div>
                  <div className="match-status">
                    <span className={match.status?.toLowerCase()}>
                      {match.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
};

export default MatchesList;
