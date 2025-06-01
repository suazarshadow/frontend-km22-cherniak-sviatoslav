import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, logout } from "./auth";
import WeatherWidget from './weatherwidget.jsx';
import imgmap from "../img/imgmap.jpg";
import logo from "../img/logo.png"



export default function Home(){
  const user = getCurrentUser();
  return (
    <div className="main-wrapper">

      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src= {logo} alt="CВЛ Логотип" className="logo-img" />
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

      <main>
        <section className="hero">
          <div className="container">
            <h1>Ласкаво просимо на майданчик!</h1>
            <p>Офіційна платформа волейбольної ліги України</p>
            <button>Дивитись матчі</button>
          </div>
        </section>

       
        <section id="news" className="news">
          <div className="container news-centered">
            <h2>Останні новини</h2>
            <div className="news-grid">
              <article className="news-item">
                <div className="video-wrapper">
                  <iframe width="100%" height="200" src="https://www.youtube.com/embed/VIDEO_ID_1" title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
                </div>
                <h3>Великий матч у Києві</h3>
                <p>Новина про ключовий матч між топ-командами.</p>
              </article>

              <article className="news-item">
                <div className="video-wrapper">
                  <iframe width="100%" height="200" src="https://www.youtube.com/embed/VIDEO_ID_2" title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
                </div>
                <h3>Інтерв'ю з MVP</h3>
                <p>Ексклюзивне інтерв'ю з найкращим гравцем тижня.</p>
              </article>
            </div>
          </div>
        </section>

    
        <section id="matches" className="matches">
          <div className="container matches-centered">
            <h2>Найближчі матчі</h2>
            <div className="table-wrapper">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Команда А</th>
                    <th>Команда Б</th>
                    <th>Місце</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24.05.2025</td>
                    <td>Київські Яструби</td>
                    <td>Львівські Леви</td>
                    <td>Київ Арена</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="more-button">
              <Link to="/matchschedule">Більше матчів →</Link>
            </div>
          </div>
        </section>


        <section className="weather-section">
          <div className="container">
            <h2 className="center-heading">Прогноз погоди</h2>
            <WeatherWidget />
          </div>
        </section>

   
        <section className="form-section">
          <div className="container">
            <h2 className="center-heading">Долучайтесь до ліги!</h2>
            <div className="form-wrapper centered">
              <p className="promo-text">
                Готові показати свій рівень? Зареєструйте команду та приєднуйтесь до змагань найкращих волейбольних колективів країни!
              </p>
              <Link to="/user" className="register-button">Зареєструвати команду</Link>
            </div>
          </div>
        </section>
        <section className="image-map-section">
          <img src={imgmap} useMap="#main-map" alt="Інтерактивна мапа" className="image-map" />

          <map name="main-map">
            <area
              shape="rect"
              coords="115,322,1086,508"
              title="Команди"
              href="/teams"
              alt="Команди"
            />
            <area
              shape="rect"
              coords="522,232,1599,387"
              title="Групи"
              href="/group"
              alt="Групи"
            />
          </map>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2025 ПолянаБол. Всі права захищені.</p>
        </div>
      </footer>
    </div>
  );
}
