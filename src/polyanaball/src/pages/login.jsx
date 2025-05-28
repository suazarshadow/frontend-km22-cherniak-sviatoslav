import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Проста перевірка (заміни на справжню авторизацію, якщо треба)
    if (username === "admin" && password === "1234") {
      // Зберігаємо ім'я користувача в localStorage (або контекст)
      localStorage.setItem("username", username);

      // Перенаправлення на сторінку користувача
      navigate("/admin");
    } else {
      setError("Неправильний логін або пароль");
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
            <a href="#">
              <img src="/img/logo.png" alt="CВЛ Логотип" className="logo-img" />
            </a>
          </div>
          <nav>
            <ul>
              <li><a href="/">Головна</a></li>
              <li><a href="/teams">Команди</a></li>
              <li><a href="/group">Сітка</a></li>
              <li><a href="/players">Гравці</a></li>
              <li><a href="/login">Увійти</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="form-section">
        <div className="form-wrapper centered">
          <h2 className="center-heading">Вхід до акаунту</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Логін"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input type="submit" value="Увійти" />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2025 ПолянаБол. Всі права захищені.</p>
        </div>
      </footer>
    </>
  );
}
