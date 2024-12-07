import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import VenueStats from "./components/VenueStats";
import TeamAverage from "./components/TeamAverage"; // Keep this single import
import Feature3 from "./components/Feature3";
import Feature4 from "./components/Feature4";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/venue" element={<VenueStats />} />
        <Route path="/average" element={<TeamAverage />} />
        <Route path="/feature3" element={<Feature3 />} />
        <Route path="/feature4" element={<Feature4 />} />
      </Routes>
    </Router>
  );
}

export default App;
