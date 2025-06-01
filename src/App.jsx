import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./pages/home";
import Teams from "./pages/teams";
import Group from "./pages/group";
import Players from "./pages/players";
import Login from "./pages/login";
import Admin from "./pages/admin";
import Matches from "./pages/matchschedule";
import Account from "./pages/user";
import TeamDetail from "./teams/:teamId";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamId" element={<TeamDetail />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/group" element={<Group />} />
        <Route path="/players" element={<Players />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;