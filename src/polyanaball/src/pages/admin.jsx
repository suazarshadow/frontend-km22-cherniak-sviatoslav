import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export default function AdminPanel() {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [errorTeams, setErrorTeams] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [form, setForm] = useState({
  date: "",
  teamA: "",
  teamB: "",
  scoreA: "",
  scoreB: "",
  status: "Заплановано"
});
  const [editMatch, setEditMatch] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [errorPlayers, setErrorPlayers] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [errorGroups, setErrorGroups] = useState(null);

  useEffect(() => {
    if (activeSection === "groups") {
      fetch("http://localhost:3001/api/groups")
        .then(res => res.json())
        .then(data => {
          const sorted = data.sort((a, b) => b.total_sets_won - a.total_sets_won);
          setGroups(sorted);
        })
        .catch(err => setErrorGroups(err.message))
        .finally(() => setLoadingGroups(false));
    }
  }, [activeSection]);

  const [groupForm, setGroupForm] = useState({
    name: "",
    team_1_id: "",
    team_2_id: "",
    team_3_id: "",
    team_4_id: ""
  });
  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroupForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();

    const selectedTeams = [
      groupForm.team_1_id,
      groupForm.team_2_id,
      groupForm.team_3_id,
      groupForm.team_4_id
    ].filter(Boolean);

    const uniqueTeams = new Set(selectedTeams);
    if (selectedTeams.length !== uniqueTeams.size) {
      alert("Команда не може бути в групі двічі");
      return;
    }

    const res = await fetch("http://localhost:3001/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groupForm)
    });

    if (!res.ok) {
      alert("Помилка при створенні групи");
      return;
    }

    alert("Групу створено");
    setGroupForm({ name: "", team_1_id: "", team_2_id: "", team_3_id: "", team_4_id: "" });
    const updatedGroups = await fetch("http://localhost:3001/api/groups").then(res => res.json());
    setGroups(updatedGroups);
  };

  useEffect(() => {
    if (activeSection === "players") {
      fetch("http://localhost:3001/api/players")
        .then(res => {
          if (!res.ok) throw new Error("Не вдалося завантажити гравців");
          return res.json();
        })
        .then(data => setPlayers(data))
        .catch(error => setErrorPlayers(error.message))
        .finally(() => setLoadingPlayers(false));
    }
}, [activeSection]);

    const handleDeletePlayer = async (id) => {
      if (!window.confirm("Ви впевнені, що хочете видалити цього гравця?")) return;

      try {
        const res = await fetch(`http://localhost:3001/api/players/${id}`, {
          method: "DELETE"
        });

        if (!res.ok) throw new Error("Помилка при видаленні");

        setPlayers(prev => prev.filter(player => player.id !== id));
        alert("Гравця видалено");
      } catch (err) {
        console.error(err);
        alert("Не вдалося видалити гравця");
      }
    };
  
  const handleDeleteUser = async (id) => {
  if (!window.confirm("Ви впевнені, що хочете видалити цього користувача?")) return;

  try {
    const res = await fetch(`http://localhost:3001/api/user/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Помилка при видаленні");

    setUsers(prev => prev.filter(user => user.id !== id));
    alert("Користувача видалено");
  } catch (err) {
    console.error(err);
    alert("Не вдалося видалити користувача");
  }
};
  useEffect(() => {
    if (activeSection === "users") {
      fetch("http://localhost:3001/api/user")
        .then(res => {
          if (!res.ok) throw new Error("Не вдалося завантажити користувачів");
          return res.json();
        })
        .then(data => setUsers(data))
        .catch(error => setErrorUsers(error.message))
        .finally(() => setLoadingUsers(false));
    }
  }, [activeSection]);


const handleEditMatch = (match) => {
  setEditMatch(match);
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditMatch(prev => ({ ...prev, [name]: value }));
};

const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`http://localhost:3001/api/matches/${editMatch.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score_a: editMatch.scoreA,
        score_b: editMatch.scoreB,
        status: editMatch.status
      })
    });
    if (!res.ok) throw new Error("Помилка при оновленні матчу");

    alert("Матч оновлено");
    setEditMatch(null);
  } catch (err) {
    console.error(err);
    alert("Не вдалося оновити матч");
  }
};
useEffect(() => {
  if (activeSection === "matches") {
    fetch("http://localhost:3001/api/matches")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("Помилка завантаження матчів:", err));
  }
}, [activeSection]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};

const handleCreateMatch = async (e) => {
  e.preventDefault();

  if (form.teamA === form.teamB) {
    alert("Команди A і B не можуть бути однаковими.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!res.ok) throw new Error("Помилка при створенні матчу");

    alert("Матч успішно створено");
    fetch("http://localhost:3001/api/matches")
    .then(res => res.json())
    .then(data => setMatches(data));
  } catch (err) {
    console.error(err);
    alert("Не вдалося створити матч");
  }
};


  const handleDeleteTeam = async (id) => {
  if (!window.confirm("Ви впевнені, що хочете видалити цю команду?")) return;

  try {
    const response = await fetch(`http://localhost:3001/api/deleteteams/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Помилка при видаленні команди");

    setTeams(prevTeams => prevTeams.filter(team => team.id !== id));
  } catch (error) {
    console.error(error);
    alert("Не вдалося видалити команду");
  }
};

  useEffect(() => {
      if (activeSection === "teams") {
        fetch('http://localhost:3001/api/loadteams')
          .then(res => {
            if (!res.ok) throw new Error("Не вдалося завантажити команди");
            return res.json();
          })
          .then(data => setTeams(data))
          .catch(error => setErrorTeams(error.message))
          .finally(() => setLoadingTeams(false));
      }
  }, [activeSection]);
  const [matches, setMatches] = useState([]);
  
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
          </ul>
        </nav>
      </aside>

      <main className="main-panel">
        <div className="panel-header">
          <Link to="/" className="back-button">← Назад на сайт</Link>
        </div>

        <section id="dashboard" className={`panel-section ${activeSection === "dashboard" ? "active" : ""}`}>
          <h1>Дашборд</h1>
          <div className="cards">
            <div className="card">
              <div className="card-icon"></div>
              <div className="card-content">
                <h3>Команд</h3>
                <p className="card-value">12</p>
              </div>
            </div>
            <div className="card">
              <div className="card-icon"></div>
              <div className="card-content">
                <h3>Матчів</h3>
                <p className="card-value">24</p>
              </div>
            </div>
            <div className="card">
              <div className="card-icon"></div>
              <div className="card-content">
                <h3>Користувачів</h3>
                <p className="card-value">389</p>
              </div>
            </div>
          </div>
        </section>

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
                    <td>{match.team_a_name}</td>
                    <td>{match.team_b_name}</td>
                    <td>{match.location}</td>
                    <td>
                      <span className={`status-badge ${match.status.toLowerCase()}`}>
                        {match.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEditMatch(match)}>Редагувати</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {editMatch && (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <h3>Редагувати матч</h3>
                <label>Рахунок A:
                  <input type="number" name="scoreA" value={editMatch.scoreA} onChange={handleEditChange} />
                </label>
                <label>Рахунок B:
                  <input type="number" name="scoreB" value={editMatch.scoreB} onChange={handleEditChange} />
                </label>
                <label>Статус:
                  <select name="status" value={editMatch.status} onChange={handleEditChange}>
                    <option value="Заплановано">Заплановано</option>
                    <option value="Live">Live</option>
                    <option value="Завершено">Завершено</option>
                    <option value="Скасовано">Скасовано</option>
                  </select>
                </label>
                <button type="submit">Зберегти</button>
              </form>
            )}

          <div className="add-form">
            <h3>Додати новий матч</h3>
           <form className="match-form" onSubmit={handleCreateMatch}>
              <label>Дата:
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </label>

              <label>Команда A:
                <select name="teamA" value={form.teamA} onChange={handleChange} required>
                  <option value="">-- Виберіть --</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>

              <label>Команда B:
                <select name="teamB" value={form.teamB} onChange={handleChange} required>
                  <option value="">-- Виберіть --</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>

              <label>Рахунок A:
                <input type="number" name="scoreA" value={form.scoreA} onChange={handleChange} />
              </label>

              <label>Рахунок B:
                <input type="number" name="scoreB" value={form.scoreB} onChange={handleChange} />
              </label>

              <label>Статус:
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Заплановано">Заплановано</option>
                  <option value="Live">Live</option>
                  <option value="Завершено">Завершено</option>
                  <option value="Скасовано">Скасовано</option>
                </select>
              </label>

              <button type="submit">Додати матч</button>
            </form>

          </div>
        </section>

        <section id="teams" className={`panel-section ${activeSection === "teams" ? "active" : ""}`}>
          <div className="section-header">
            <h2>Керування командами</h2>
          </div>
          {loadingTeams ? (
            <p>Завантаження...</p>
          ) : errorTeams ? (
            <p className="error">{errorTeams}</p>
          ) : teams.length === 0 ? (
            <p>Команди не знайдено.</p>
          ) : (
            <ul className="team-cards">
              {teams.map(team => (
                <li key={team.id} className="team-card">
                  <img
                    src={team.logoUrl || "/placeholder.png"}
                    alt={`${team.name} лого`}
                    className="team-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <h3>{team.name}</h3>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section id="players" className={`panel-section ${activeSection === "players" ? "active" : ""}`}>
          <h2>Гравці</h2>
          {loadingPlayers ? (
            <p>Завантаження гравців...</p>
          ) : errorPlayers ? (
            <p className="error">{errorPlayers}</p>
          ) : players.length === 0 ? (
            <p>Гравців не знайдено.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Імʼя</th>
                  <th>Позиція</th>
                  <th>Команда</th>
                  <th>Дія</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr key={player.id}>
                    <td>{player.id}</td>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.team_id}</td>
                    <td>
                      <button onClick={() => handleDeletePlayer(player.id)}>Видалити</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </section>

        <section id="users" className={`panel-section ${activeSection === "users" ? "active" : ""}`}>
          <h2>Користувачі</h2>
          {loadingUsers ? (
              <p>Завантаження користувачів...</p>
            ) : errorUsers ? (
              <p className="error">{errorUsers}</p>
            ) : users.length === 0 ? (
              <p>Користувачів не знайдено.</p>
            ) : (
              <table className="admin-table">
               <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ім'я</th>
                    <th>Роль</th>
                    <th>Дія</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <button onClick={() => handleDeleteUser(user.id)}>Видалити</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </section>

        <section id="groups" className={`panel-section ${activeSection === "groups" ? "active" : ""}`}>
          <h2>Групи</h2>
          {loadingGroups ? (
            <p>Завантаження груп...</p>
          ) : errorGroups ? (
            <p className="error">{errorGroups}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Назва</th>
                  <th>Команди</th>
                  <th>Виграно сетів (сумарно)</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(group => (
                  <tr key={group.id}>
                    <td>{group.name}</td>
                    <td>
                      {[group.team1_name, group.team2_name, group.team3_name, group.team4_name]
                        .filter(Boolean)
                        .join(", ")}
                    </td>
                    <td>{group.total_sets_won}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <form className="group-form" onSubmit={handleGroupSubmit}>
            <h3>Створити нову групу</h3>
            <label>Назва групи:
              <input name="name" value={groupForm.name} onChange={handleGroupChange} required />
            </label>
            {[1, 2, 3, 4].map(i => (
              <label key={i}>Команда {i}:
                <select name={`team_${i}_id`} value={groupForm[`team_${i}_id`]} onChange={handleGroupChange}>
                  <option value="">-- Виберіть --</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>
            ))}
            <button type="submit">Додати групу</button>
          </form>
        </section>

      </main>
    </div>
  );
}