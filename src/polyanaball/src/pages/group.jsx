import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("group-a");

  return (
    <main className="matches">
      <h2 className="center-heading">Груповий етап та Плей-оф</h2>

      <div className="group-tabs">
        <button onClick={() => setActiveTab("group-a")}>Група A</button>
        <button onClick={() => setActiveTab("group-b")}>Група B</button>
        <button onClick={() => setActiveTab("playoff")}>Плей-оф</button>
      </div>

      {activeTab === "group-a" && (
        <div id="group-a" className="group-view">
          <h3>Група A</h3>
          <table className="compact-table">
            <thead>
              <tr><th>Команда</th><th>Ігор</th><th>Очки</th></tr>
            </thead>
            <tbody>
              <tr><td>Київські Яструби</td><td>3</td><td>9</td></tr>
              <tr><td>Львівські Леви</td><td>3</td><td>6</td></tr>
              <tr><td>Полтавські Орли</td><td>3</td><td>3</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "group-b" && (
        <div id="group-b" className="group-view">
          <h3>Група B</h3>
          <table className="compact-table">
            <thead>
              <tr><th>Команда</th><th>Ігор</th><th>Очки</th></tr>
            </thead>
            <tbody>
              <tr><td>Одеські Дельфіни</td><td>3</td><td>9</td></tr>
              <tr><td>Харківські Ведмеді</td><td>3</td><td>6</td></tr>
              <tr><td>Дніпровські Риси</td><td>3</td><td>3</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "playoff" && (
        <div id="playoff" className="group-view">
          <h3>Сітка Плей-оф</h3>
          <div className="playoff-grid">
            <div className="bracket">
              <h4>Півфінал 1</h4>
              <p>Київські Яструби vs Харківські Ведмеді</p>
            </div>
            <div className="bracket">
              <h4>Півфінал 2</h4>
              <p>Одеські Дельфіни vs Львівські Леви</p>
            </div>
            <div className="bracket">
              <h4>Фінал</h4>
              <p>Очікується</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}