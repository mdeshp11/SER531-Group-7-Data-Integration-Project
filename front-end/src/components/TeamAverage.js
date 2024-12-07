import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./TeamAverage.css";

// Import team logos
const teamLogos = {
  "Chennai Super Kings": `${process.env.PUBLIC_URL}/CSK.png`,
  "Punjab Kings": `${process.env.PUBLIC_URL}/PK.png`,
  "Delhi Capitals": `${process.env.PUBLIC_URL}/DC.png`,
  "Gujarat Titans": `${process.env.PUBLIC_URL}/GT.png`,
  "Kolkata Knight Riders": `${process.env.PUBLIC_URL}/KKR.png`,
  "Lucknow Super Giants": `${process.env.PUBLIC_URL}/LSG.png`,
  "Rajasthan Royals": `${process.env.PUBLIC_URL}/RR.png`,
  "Royal Challengers Bengaluru": `${process.env.PUBLIC_URL}/RCB.png`,
};

const backendURL = "http://127.0.0.1:5050";

function TeamAverage() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamStats, setTeamStats] = useState(null);
  const [data, setData] = useState({});
  const [showLogo, setShowLogo] = useState(false); // State to control logo visibility

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/ipl_server/team_stats`);
        setData(response.data); // Save data from Axios response
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamData();
  }, []);

  const handleTeamChange = (event) => {
    const teamName = event.target.value;
    setSelectedTeam(teamName);
    setTeamStats(data[teamName] || null);

    // Trigger the logo animation
    setShowLogo(false);
    setTimeout(() => setShowLogo(true), 100); // Reset animation
  };

  return (
    <div className="team-container">
      <h1 className="team-header">Team Average Stats</h1>
      <div className="dropdown-container">
        <select
          id="team-select"
          className="team-select"
          value={selectedTeam}
          onChange={handleTeamChange}
        >
          <option value="">Select a Team</option>
          {Object.keys(data).map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      {teamStats && (
        <div className="stats-container">
          <h2 className="team-name">{selectedTeam}</h2>
          <div className="average-score">
            Average Score Batting First: {teamStats.averageScoreBattingFirst}
          </div>
        </div>
      )}
      {showLogo && selectedTeam && teamLogos[selectedTeam] && (
        <img
          src={teamLogos[selectedTeam]}
          alt={`${selectedTeam} logo`}
          className="team-logo"
        />
      )}
    </div>
  );
}

export default TeamAverage;
