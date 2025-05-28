import React from "react";
import { Link } from "react-router-dom";

export default function Players() {
  return (
    <div>
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src="/img/logo.png" alt="CВЛ Логотип" className="logo-img" />
            </Link>
          </div>
          <nav>
            <ul>
              <li><Link to="/">Головна</Link></li>
              <li><Link to="/teams">Команди</Link></li>
              <li><Link to="/group">Сітка</Link></li>
              <li><Link to="/players">Гравці</Link></li>
              <li><Link to="/login">Увійти</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <h2 className="center-heading">Гравці ліги</h2>

        <div className="filter-bar">
          <label htmlFor="teamFilter">Команда:</label>
          <select id="teamFilter">
            <option value="all">Всі</option>
            <option value="kyiv">Київські Яструби</option>
            <option value="lviv">Львівські Леви</option>
            <option value="odesa">Одеські Дельфіни</option>
          </select>

          <label htmlFor="positionFilter">Позиція:</label>
          <select id="positionFilter">
            <option value="all">Всі</option>
            <option value="dogr">Догравальник</option>
            <option value="libero">Ліберо</option>
            <option value="block">Блокуючий</option>
            <option value="zvaz">Зв’язуючий</option>
          </select>
        </div>

        <div className="players-grid">
          <div className="player-card" data-team="kyiv" data-position="dogr">
            <img src="/img/player1.jpg" alt="Гравець 1" className="player-photo" />
            <div className="player-name">Іван Коваль</div>
            <div className="player-position">Київські Яструби</div>
          </div>

          <div className="player-card" data-team="lviv" data-position="libero">
            <img src="/img/player2.jpg" alt="Гравець 2" className="player-photo" />
            <div className="player-name">Олексій Бондаренко</div>
            <div className="player-position">Львівські Леви</div>
          </div>

          <div className="player-card" data-team="odesa" data-position="block">
            <img src="/img/player3.jpg" alt="Гравець 3" className="player-photo" />
            <div className="player-name">Андрій Савчук</div>
            <div className="player-position">Одеські Дельфіни</div>
          </div>

          <div className="player-card" data-team="kyiv" data-position="zvaz">
            <img src="/img/player4.jpg" alt="Гравець 4" className="player-photo" />
            <div className="player-name">Дмитро Іванченко</div>
            <div className="player-position">Київські Яструби</div>
          </div>
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
