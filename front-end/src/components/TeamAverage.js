import React, { useState/*, useEffect */} from "react";
//import axios from "axios";
import "./TeamAverage.css"; // Import updated CSS

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
  "Sunrisers Hyderabad": `${process.env.PUBLIC_URL}/SRH.png`,
};

//BACKEND URL
// const backendURL = 'http://127.0.0.1:5050'

// Import custom batting icon
const battingIcon = `${process.env.PUBLIC_URL}/bat.png`;

// Manual data for team stats
const sampleTeamData = {
  "Chennai Super Kings": {
    averageScoreBattingFirst: "170.0",
  },
  "Deccan Chargers": {
    averageScoreBattingFirst: "158.0",
  },
  "Delhi Capitals": {
    averageScoreBattingFirst: "164.0",
  },
  "Gujarat Lions": {
    averageScoreBattingFirst: "161.0",
  },
  "Gujarat Titans": {
    averageScoreBattingFirst: "177.0",
  },
  "Kolkata Knight Riders": {
    averageScoreBattingFirst: "166.0",
  },
  "Lucknow Super Giants": {
    averageScoreBattingFirst: "181.0",
  },
};

function TeamAverage() {
  //const [teamsData, setTeamsData] = useState({}); // Store team stats fetched from backend
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showLogo, setShowLogo] = useState(false); // State to control logo visibility

  // Fetch data from the backend API
  // useEffect(() => {
  //   const fetchTeamData = async () => {
  //     try {
  //       const response = await axios.get("backendURL + '/api/ipl_server");
  //       setTeamsData(response.data); // Store data in state
  //     } catch (error) {
  //       console.error("Error fetching team data:", error);
  //     }
  //   };

  //   fetchTeamData();
  // }, []);

  const handleTeamChange = (event) => {
    const teamName = event.target.value;
    setSelectedTeam(teamName);

    // Trigger the logo animation
    setShowLogo(false);
    setTimeout(() => setShowLogo(true), 100); // Reset animation
  };

  //const teamStats = teamsData[selectedTeam] || null;
  const teamStats = sampleTeamData[selectedTeam] || null;

  return (
    <div className="team-container">
      <h1 className="team-header">Team Average</h1>
      <div className="dropdown-container">
        <select
          id="team-select"
          className="team-select"
          value={selectedTeam}
          onChange={handleTeamChange}
        >
          <option value="">Select a Team</option>
          {Object.keys(sampleTeamData).map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      {teamStats && (
        <div className="stats-container">
          <h2 className="team-name">{selectedTeam}</h2>
          <p className="average-score">
  <span className="batting-label">
    <img
      src={battingIcon}
      alt="Batting Icon"
      className="batting-icon-custom"
    />{" "}
    Average Score Batting First:
  </span>
  <span className="batting-score">{teamStats.averageScoreBattingFirst}</span>
</p>

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
