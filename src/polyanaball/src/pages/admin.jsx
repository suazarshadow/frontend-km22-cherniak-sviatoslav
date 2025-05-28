import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [matches, setMatches] = useState([
    {
      id: 1,
      date: "24.05.2025",
      teamA: "Київські Яструби",
      teamB: "Львівські Леви",
      location: "Київ Арена",
      status: "Заплановано"
    },
    {
      id: 2,
      date: "20.05.2025",
      teamA: "Одеські Дельфіни",
      teamB: "Харківські Ведмеді",
      location: "Арена Південь",
      status: "Завершено"
    }
  ]);
  
  const [newMatch, setNewMatch] = useState({
    date: "",
    teamA: "",
    teamB: "",
    location: "",
    status: "Заплановано"
  });

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMatch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitMatch = (e) => {
    e.preventDefault();
    const newMatchWithId = { ...newMatch, id: matches.length + 1 };
    setMatches([...matches, newMatchWithId]);
    setNewMatch({
      date: "",
      teamA: "",
      teamB: "",
      location: "",
      status: "Заплановано"
    });
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>ПолянаБол Admin</h2>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li>
              <button 
                className={`sidebar-link ${activeSection === "dashboard" ? "active" : ""}`}
                onClick={() => handleSectionChange("dashboard")}
              >
                Дашборд
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeSection === "matches" ? "active" : ""}`}
                onClick={() => handleSectionChange("matches")}
              >
                Матчі
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeSection === "teams" ? "active" : ""}`}
                onClick={() => handleSectionChange("teams")}
              >
                Команди
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeSection === "players" ? "active" : ""}`}
                onClick={() => handleSectionChange("players")}
              >
                Гравці
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeSection === "news" ? "active" : ""}`}
                onClick={() => handleSectionChange("news")}
              >
                Новини
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeSection === "users" ? "active" : ""}`}
                onClick={() => handleSectionChange("users")}
              >
                Користувачі
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeSection === "groups" ? "active" : ""}`}
                onClick={() => handleSectionChange("groups")}
              >
                Групи
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => handleSectionChange("settings")}
              >
                Налаштування
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-panel">
        <div className="panel-header">
          <Link to="/" className="back-button">← Назад на сайт</Link>
        </div>

        {/* Dashboard Section */}
        <section id="dashboard" className={`panel-section ${activeSection === "dashboard" ? "active" : ""}`}>
          <h1>Дашборд</h1>
          <div className="cards">
            <div className="card">
              <div className="card-icon">🏐</div>
              <div className="card-content">
                <h3>Команд</h3>
                <p className="card-value">12</p>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">⚽</div>
              <div className="card-content">
                <h3>Матчів</h3>
                <p className="card-value">24</p>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">👥</div>
              <div className="card-content">
                <h3>Користувачів</h3>
                <p className="card-value">389</p>
              </div>
            </div>
          </div>
        </section>

        {/* Matches Section */}
        <section id="matches" className={`panel-section ${activeSection === "matches" ? "active" : ""}`}>
          <div className="section-header">
            <h2>Список матчів</h2>
          </div>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Команда A</th>
                  <th>Команда B</th>
                  <th>Місце</th>
                  <th>Статус</th>
                  <th>Дія</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(match => (
                  <tr key={match.id}>
                    <td>{match.date}</td>
                    <td>{match.teamA}</td>
                    <td>{match.teamB}</td>
                    <td>{match.location}</td>
                    <td>
                      <span className={`status-badge ${match.status.toLowerCase()}`}>
                        {match.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/edit-match/${match.id}`} className="edit-link">
                        Редагувати
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="add-form">
            <h3>Додати новий матч</h3>
            <form className="match-form" onSubmit={handleSubmitMatch}>
              <div className="form-group">
                <label htmlFor="match-date">Дата:</label>
                <input 
                  type="date" 
                  id="match-date" 
                  name="date" 
                  value={newMatch.date}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="team-a">Команда A:</label>
                <input 
                  type="text" 
                  id="team-a" 
                  name="teamA" 
                  value={newMatch.teamA}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="team-b">Команда B:</label>
                <input 
                  type="text" 
                  id="team-b" 
                  name="teamB" 
                  value={newMatch.teamB}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Місце проведення:</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={newMatch.location}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Статус:</label>
                <select 
                  id="status" 
                  name="status" 
                  value={newMatch.status}
                  onChange={handleInputChange}
                >
                  <option value="Заплановано">Заплановано</option>
                  <option value="Live">Live</option>
                  <option value="Завершено">Завершено</option>
                  <option value="Скасовано">Скасовано</option>
                </select>
              </div>
              
              <button type="submit" className="submit-button">Додати матч</button>
            </form>
          </div>
        </section>

        {/* Other sections would go here similarly */}
        <section id="teams" className={`panel-section ${activeSection === "teams" ? "active" : ""}`}>
          <div className="section-header">
            <h2>Керування командами</h2>
          </div>
          <p>Тут можна буде додавати та редагувати команди.</p>
        </section>

        {/* Placeholder for other sections */}
        <section id="players" className={`panel-section ${activeSection === "players" ? "active" : ""}`}>
          <h2>Гравці</h2>
          <p>Керування списком гравців.</p>
        </section>

        <section id="news" className={`panel-section ${activeSection === "news" ? "active" : ""}`}>
          <h2>Новини</h2>
          <p>Додайте або редагуйте новини для сайту.</p>
        </section>

        <section id="users" className={`panel-section ${activeSection === "users" ? "active" : ""}`}>
          <h2>Користувачі</h2>
          <p>Список зареєстрованих користувачів.</p>
        </section>

        <section id="groups" className={`panel-section ${activeSection === "groups" ? "active" : ""}`}>
          <h2>Групи та плей-оф</h2>
          <p>Керування груповим етапом та плей-оф сіткою.</p>
        </section>

        <section id="settings" className={`panel-section ${activeSection === "settings" ? "active" : ""}`}>
          <h2>Налаштування</h2>
          <p>Загальні налаштування панелі адміністратора.</p>
        </section>
      </main>
    </div>
  );
}