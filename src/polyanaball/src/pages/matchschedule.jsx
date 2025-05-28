import React from "react";
import { Link } from "react-router-dom";

export default function Matches() {
  return (
    <div>
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src="../img/logo.png" alt="CВЛ Логотип" className="logo-img" />
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

      <main className="matches">
        <h2 className="center-heading">Відстеження матчів</h2>
        <div className="tab-bar">
          <button className="tab-button" data-target="live-tab">LIVE</button>
          <button className="tab-button" data-target="upcoming-tab">Найближчі</button>
          <button className="tab-button" data-target="results-tab">Результати</button>
        </div>

        <div className="tab-content" id="live-tab">
          <h3>Live матчі</h3>
          <p className="match-live">Київські Яструби vs Львівські Леви — 2:1 (25-22, 23-25, 25-20)</p>
        </div>

        <div className="tab-content" id="upcoming-tab">
          <h3>Найближчі матчі</h3>
          <table className="compact-table">
            <thead>
              <tr><th>Дата</th><th>Команда A</th><th>Команда B</th><th>Місце</th></tr>
            </thead>
            <tbody>
              <tr><td>28.05.2025</td><td>Харківські Ведмеді</td><td>Одеські Дельфіни</td><td>Харків Арена</td></tr>
            </tbody>
          </table>
        </div>

        <div className="tab-content" id="results-tab">
          <h3>Останні результати</h3>
          <ul>
            <li>Київські Яструби 3:1 Львівські Леви</li>
            <li>Одеські Дельфіни 2:3 Дніпровські Риси</li>
          </ul>
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
