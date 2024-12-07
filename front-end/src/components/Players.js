import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Players.css";

const backendURL = "http://127.0.0.1:5050";

function Players() {
  const [clutchData, setClutchData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/ipl_server/clutch_players`);
        setClutchData(response.data);
      } catch (error) {
        console.error("Error fetching clutch players data:", error);
      }
    };
    fetchData();
  }, []);

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const renderTable = () => {
    if (!clutchData || !selectedTeam || !clutchData[selectedTeam]) {
      return <p>Please select a team and category to view data.</p>;
    }

    const categoryData = clutchData[selectedTeam][selectedCategory.toLowerCase()];
    if (!categoryData) return <p>No data available for this category.</p>;

    return (
      <div className="table-backdrop">
        <table className="players-table">
          <thead>
            <tr>
              <th>Player</th>
              {/* Generate table headers dynamically */}
              {Object.keys(categoryData[Object.keys(categoryData)[0]] || {}).map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Populate table rows */}
            {Object.keys(categoryData).map((key, index) => (
              <tr key={index}>
                <td>{key}</td>
                {Object.values(categoryData[key]).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="players-page">
      <h1 className="player-header">Clutch Players</h1>
      <div className="dropdown-container">
        {/* Dropdown to select team */}
        <select value={selectedTeam} onChange={handleTeamChange} className="team-dropdown">
          <option value="" disabled>
            Select a Team
          </option>
          {clutchData &&
            Object.keys(clutchData).map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
        </select>
        {/* Dropdown to select category */}
        <select value={selectedCategory} onChange={handleCategoryChange} className="team-dropdown">
          <option value="" disabled>
            Select Player Category
          </option>
          <option value="Batsmen">Batsmen</option>
          <option value="Bowlers">Bowlers</option>
          <option value="Fielders">Fielders</option>
        </select>
      </div>
      {renderTable()}
    </div>
  );
}

export default Players;
