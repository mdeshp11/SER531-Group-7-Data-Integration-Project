import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlayerDismissal.css";

const backendURL = "http://127.0.0.1:5050";

function PlayerDismissal() {
  // State to store the fetched player stats
  const [playerStats, setPlayerStats] = useState({});
  // State to store the search query
  const [searchQuery, setSearchQuery] = useState("");
  // State to store the filtered stats
  const [filteredStats, setFilteredStats] = useState(null);

  // Fetch player dismissal stats on component mount
  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/ipl_server/player_dismissals`); // Replace with your API endpoint
        setPlayerStats(response.data); // Save fetched data in state
      } catch (error) {
        console.error("Error fetching player dismissal stats:", error);
      }
    };

    fetchPlayerStats();
  }, []); // Run only once when the component mounts

  // Handle the search query change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      // Perform search on the fetched data
      console.log('QUERYY: ', query)
      console.log('playerstats', playerStats)
      console.log('RESULT: ', playerStats[query])
      const player = playerStats[query];
      setFilteredStats(player || null); // Set the filtered stats if the player exists
    } else {
      // Reset the filtered stats if the query is empty
      setFilteredStats(null);
    }
  };

  return (
    <div className="players-page">
    <div className="player-dismissal-container">
      <h1 className="header">Player Dismissal Stats</h1>
      
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a player"
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      {/* Display Player Stats */}
      {filteredStats ? (
        <div className="player-stats">
          <h2>{searchQuery}</h2>
          <ul>
            {Object.keys(filteredStats).map((dismissalType) => (
              <li key={dismissalType}>
                <strong>{dismissalType}:</strong> {filteredStats[dismissalType]}
              </li>
            ))}
          </ul>
        </div>
      ) : searchQuery ? (
        <p>No stats found for {searchQuery}</p>
      ) : (
        <p>Please search for a player</p>
      )}
    </div>
    </div>
  );
}

export default PlayerDismissal;
