import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UserAccount() {
  const [username] = useState("Користувач"); 
  const [teamName, setTeamName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");


  return (
    <div>
      <header>
        <div className="container">
          <div className="logo">
            <a href="#">
              <img src="img/logo.png" alt="CВЛ Логотип" className="logo-img" />
            </a>
          </div>
          <nav>
            <ul>
              <li><a href="index.html">Головна</a></li>
              <li><a href="teams.html">Команди</a></li>
              <li><a href="group.html">Сітка</a></li>
              <li><a href="players.html">Гравці</a></li>
              <li><a href="login.html">Увійти</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="form-section">
        <div className="form-wrapper centered">
          <h2 className="center-heading">Мій акаунт</h2>
          <p>Ласкаво просимо, <strong>{username}</strong>!</p>

          <h3>Додати свою команду</h3>
          <form id="teamForm" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Назва команди"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Місто"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <textarea
              placeholder="Опис команди"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <input type="submit" value="Додати команду" />
            {message && <p style={{ color: "green" }}>{message}</p>}
          </form>
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