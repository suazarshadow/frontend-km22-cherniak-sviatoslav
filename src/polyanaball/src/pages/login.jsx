import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getCurrentUser, logout } from "./auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const user = getCurrentUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Невірні дані для входу");
        return;
      }

      const data = await response.json();
      login(data);
      navigate(data.role === "admin" ? "/admin" : "/user");

    } catch (err) {
      console.error("Помилка з'єднання з сервером:", err);
      setError("Сервер недоступний");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, email })
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Помилка реєстрації");
        return;
      }

      const data = await response.json();
      setSuccess("✅ Акаунт успішно створено! Тепер ви можете увійти");
      setIsLoginMode(true);
      setUsername("");
      setPassword("");
      setEmail("");

    } catch (err) {
      console.error("Помилка реєстрації:", err);
      setError("Сервер недоступний");
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
            <a href="/">
              <img src="/img/logo.png" alt="CВЛ Логотип" className="logo-img" />
            </a>
          </div>
          <nav>
            <ul>
              <li><a href="/">Головна</a></li>
              <li><a href="/teams">Команди</a></li>
              <li><a href="/group">Сітка</a></li>
              <li><a href="/players">Гравці</a></li>
              {user ? (
                <>
                  <li><a href={user.role === "admin" ? "/admin" : "/user"}>Мій кабінет</a></li>
                  <li><button onClick={() => { logout(); window.location.reload(); }}>Вийти</button></li>
                </>
              ) : (
                <li><a href="/login">Увійти</a></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="form-section">
        <div className="form-wrapper centered">
          <h2 className="center-heading">{isLoginMode ? "Вхід до акаунту" : "Реєстрація"}</h2>
          
          <div className="form-toggle">
            <button 
              className={`toggle-btn ${isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(true)}
            >
              Увійти
            </button>
            <button 
              className={`toggle-btn ${!isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(false)}
            >
              Реєстрація
            </button>
          </div>
          
          <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Логін"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            {!isLoginMode && (
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {!isLoginMode && (
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Підтвердіть пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <button type="submit" className="submit-btn">
              {isLoginMode ? "Увійти" : "Зареєструватися"}
            </button>
            
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </form>
          
          <div className="form-footer">
            {isLoginMode ? (
              <p>
                Ще не маєте акаунту?{' '}
                <button 
                  className="switch-mode-btn" 
                  onClick={() => setIsLoginMode(false)}
                >
                  Зареєструватися
                </button>
              </p>
            ) : (
              <p>
                Вже маєте акаунт?{' '}
                <button 
                  className="switch-mode-btn" 
                  onClick={() => setIsLoginMode(true)}
                >
                  Увійти
                </button>
              </p>
            )}
          </div>
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