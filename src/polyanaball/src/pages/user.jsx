import React, { useState, useRef } from "react";
import { getCurrentUser, logout } from "./auth";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";



export default function UserAccount() {
  const navigate = useNavigate();
  const [username] = useState("Користувач");
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    height: "",
    position: "Догравальник",
    photo: null
  });
  const [teamLogo, setTeamLogo] = useState(null);
  const fileInputRef = useRef(null);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [errorPlayers, setErrorPlayers] = useState(null);
  
  const handleAddPlayer = (e) => {
    e.preventDefault();
    
    if (!newPlayer.name || !newPlayer.height || !newPlayer.position) {
      setMessage("Будь ласка, заповніть всі поля гравця");
      return;
    }
    
    const height = parseInt(newPlayer.height);
    if (isNaN(height) || height < 150 || height > 250) {
      setMessage("Ріст має бути числом від 150 до 250 см");
      return;
    }
    
    setPlayers([...players, newPlayer]);
    setNewPlayer({
      name: "",
      height: "",
      position: "Догравальник",
      photo: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePlayerChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer({ ...newPlayer, [name]: value });
  };

  const handlePlayerPhotoChange = (e) => {
    setNewPlayer({ ...newPlayer, photo: e.target.files[0] });
  };

  const handleRemovePlayer = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
  };

  const handleLogoChange = (e) => {
    setTeamLogo(e.target.files[0]);
  };

  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (players.length === 0) {
      setMessage("Будь ласка, додайте хоча б одного гравця");
      return;
    }
    
    if (!teamLogo) {
      setMessage("Будь ласка, завантажте лого команди");
      return;
    }
    const cr = getCurrentUser();

    try{
      const isthereateam = await fetch(`http://localhost:3001/api/users/${cr.id}/isthereateam`, {
        method: "GET",
      })

      const teamdata = await isthereateam.json();

      console.log(teamdata.teamId);
      if(teamdata.teamId  > 0){
        setMessage("Ви уже маєте команду")
        return
      }
    }catch (err) {
      console.error("Помилка запиту:", err);
      setMessage("Помилка з'єднання з сервером");
    };
    
    const formData = new FormData();
    formData.append('teamName', teamName);
    formData.append('teamLogo', teamLogo);
    
    players.forEach((player, index) => {
      formData.append(`players[${index}][name]`, player.name);
      formData.append(`players[${index}][height]`, player.height);
      formData.append(`players[${index}][position]`, player.position);
    });
    
     try {
      const response = await fetch("http://localhost:3001/api/create-team", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP помилка! статус: ${response.status}`);
      }
      
      const data = await response.json();
      

      if (data.success) {
        const currentUser = getCurrentUser();

     
        
   
        const teamId = Number(data.teamId);
  
        const updateResponse = await fetch(
          `http://localhost:3001/api/users/${currentUser.id}/team`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId })
          }
        );
      
        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          if (updateData.success) {
            const updatedUser = { ...currentUser, team_id: teamId };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setMessage("Команду створено та прив'язано до акаунту!");
          }
        }
      }
    } catch (err) {
      console.error("Помилка запиту:", err);
      setMessage("Помилка з'єднання з сервером");
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <div className="logo">
            <a href="#">
              <img src={logo.png} alt="CВЛ Логотип" className="logo-img" />
            </a>
          </div>
          <nav>
            <ul>
              <li><a href="/home">Головна</a></li>
              <li><a href="/teams">Команди</a></li>
              <li><a href="/group">Сітка</a></li>
              <li><a href="/players">Гравці</a></li>
              <li><button class = "logout" onClick={() => {logout(); navigate("/login");}}>Вийти</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="form-section">
        <div className="form-wrapper centered">
          <h2 className="center-heading">Мій акаунт</h2>
          <p>Ласкаво просимо, <strong>{username}</strong>!</p>
          
          <div className="form-container">
            <h3>Створити нову команду</h3>
            <form id="teamForm" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Назва команди*"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
            
              <div className="form-group">
                <label>Лого команди*</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  required
                />
              </div>
              
              <h3>Додати гравців</h3>
              <div className="player-form">
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Ім'я гравця*"
                    value={newPlayer.name}
                    onChange={handlePlayerChange}
                  />
                  
                  <input
                    type="number"
                    name="height"
                    placeholder="Ріст (см)*"
                    value={newPlayer.height}
                    onChange={handlePlayerChange}
                    min="150"
                    max="250"
                  />
                  
                  <select
                    name="position"
                    value={newPlayer.position}
                    onChange={handlePlayerChange}
                  >
                    <option value="Догравальник">Догравальник</option>
                    <option value="Діагональний">Діагональний</option>
                    <option value="Центральний Блокуючий">Центральний Блокуючий</option>
                    <option value="Ліберо">Ліберо</option>
                    <option value="Сеттер">Сеттер</option>
                  </select>
                </div>
                
                <button 
                  type="button" 
                  className="add-player-btn"
                  onClick={handleAddPlayer}
                >
                  Додати гравця
                </button>
              </div>
              
              {players.length > 0 && (
                <div className="players-list">
                  <h4>Додані гравці:</h4>
                  <table className="volleyball-table">
                    <thead>
                      <tr>
                        <th>Ім'я</th>
                        <th>Ріст (см)</th>
                        <th>Позиція</th>
                        <th>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player, index) => (
                        <tr key={index}>
                          <td>{player.name}</td>
                          <td>{player.height}</td>
                          <td>{player.position}</td>
                          <td>
                            <button 
                              type="button" 
                              className="remove-btn"
                              onClick={() => handleRemovePlayer(index)}
                            >
                              Видалити
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="form-submit">
                <input 
                  type="submit" 
                  value="Створити команду" 
                  className="submit-btn"
                />
                {message && (
                  <p className={
                    message.includes("успішно") || message.includes("прив'язано") 
                      ? "success-message" 
                      : "error-message"
                  }>
                    {message}
                  </p>
                )}
              </div>
            </form>
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