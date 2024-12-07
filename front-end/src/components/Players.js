import React, { useState, useEffect } from "react";
// import axios from "axios";
import "./Players.css"; // Custom CSS for styling

const sampleData = {
  "Chennai Super Kings": {
    batsmen: {
      "DJ Hooda": { strikeRate: "148.639", totalRuns: "437" },
      "MS Dhoni": { strikeRate: "171.975", totalRuns: "1663" },
    },
    bowlers: {
      "KK Ahmed": { totalWickets: "35" },
      "M Pathirana": { totalWickets: "27" },
    },
    fielders: {
      "DJ Hooda": { catches: "26", runouts: "2", totalContributions: "28" },
      "MS Dhoni": { catches: "23", runouts: "7", totalContributions: "30" },
    },
  },
  "Delhi Capitals": {
    batsmen: {
      "AR Patel": { strikeRate: "158.712", totalRuns: "838" },
      "F du Plessis": { strikeRate: "196.930", totalRuns: "449" },
    },
    bowlers: {
      "AR Patel": { totalWickets: "10" },
      "Kuldeep Yadav": { totalWickets: "28" },
    },
    fielders: {
      "AR Patel": { catches: "20", runouts: "1", totalContributions: "21" },
      "F du Plessis": { catches: "25", runouts: "0", totalContributions: "25" },
    },
  },
};

function Players() {
  const [clutchData, setClutchData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Set sample data for now
    setClutchData(sampleData);

    // Uncomment the following lines to fetch data from the API during integration
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get("http://127.0.0.1:5050/api/ipl_server/clutch_players");
    //     setClutchData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching clutch players data:", error);
    //   }
    // };
    // fetchData();
  }, []);

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
    setSearchTerm(""); // Clear search term on team change
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSearchTerm(""); // Clear search term on category change
  };

  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const renderTable = () => {
    if (!clutchData || !selectedTeam || !clutchData[selectedTeam]) {
      return <p>Please select a team and category to view data.</p>;
    }

    const categoryData = clutchData[selectedTeam][selectedCategory.toLowerCase()];
    if (!categoryData) return <p>No data available for this category.</p>;

    const filteredData = Object.keys(categoryData).filter((key) =>
      key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="table-backdrop">
        <table className="players-table">
          <thead>
            <tr>
              {/* Generate table headers dynamically */}
              {Object.keys(categoryData[filteredData[0]] || {}).map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Populate table rows with filtered data */}
            {filteredData.map((key, index) => (
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
          <option value="" disabled>Select a Team</option>
          {clutchData &&
            Object.keys(clutchData).map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
        </select>
        {/* Dropdown to select category */}
        <select value={selectedCategory} onChange={handleCategoryChange} className="team-dropdown">
          <option value="" disabled>Select Player</option>
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
