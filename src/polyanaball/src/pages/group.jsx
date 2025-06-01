import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, logout } from "./auth";
import logo from "../img/logo.png";




const user = getCurrentUser();

const GroupsLeaders = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/groups")
      .then(res => {
        if (!res.ok) throw new Error("Помилка при завантаженні груп");
        return res.json();
      })
      .then(data => setGroups(data))
      .catch(err => setError(err.message));
  }, []);

  const renderGroupTable = (group) => {
    const teams = [
      { name: group.team1_name, sets: group.team1_sets || 0 },
      { name: group.team2_name, sets: group.team2_sets || 0 },
      { name: group.team3_name, sets: group.team3_sets || 0 },
      { name: group.team4_name, sets: group.team4_sets || 0 }
    ]
      .filter(team => team.name)
      .sort((a, b) => b.sets - a.sets);

    return (
      <div key={group.id} className="table-wrapper" style={{ marginBottom: "3rem" }}>
        <h3 className="centered-title">{group.name}</h3>
        <table className="compact-table volleyball-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Команда</th>
              <th>Сети</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index} className={index === 0 ? "qualified" : ""}>
                <td>{index + 1}</td>
                <td className="team-name">{team.name}</td>
                <td className={index === 0 ? "win" : ""}>{team.sets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
      <main className="matches-centered">
        <h2 className="centered-title">Таблиці лідерів по групах</h2>
        {error ? <p className="error">{error}</p> :
          groups.length === 0 ? <p className="loading">Завантаження груп...</p> :
            groups.map(group => renderGroupTable(group))
        }
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2025 ПолянаБол. Всі права захищені.</p>
        </div>
      </footer>
    </div>
  );
};

export default GroupsLeaders;
