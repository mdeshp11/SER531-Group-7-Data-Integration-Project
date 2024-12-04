import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

//BACKEND URL
const backendURL = 'http://127.0.0.1:5050'

function VenueStats() {
  const [venues, setVenues] = useState([]); // State to store venue data from API
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(backendURL + '/api/ipl_server');
        console.log("API Response:", response.data);
        setVenues(response.data); // Assuming the API returns an array of venue data
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, []);

  const handleVenueChange = (event) => {
    const venueName = event.target.value;
    const venueData = venues.find((data) => data.stadium === venueName);

    setSelectedVenue(venueData);
  };

  const chartData = selectedVenue
    ? {
        labels: ["Batting First Wins", "Bowling First Wins"],
        datasets: [
          {
            data: [
              selectedVenue.battingFirstWinPercentage,
              selectedVenue.bowlingFirstWinPercentage,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      }
    : null;

  return (
    <div className="venue-container">
      <h1>Venues</h1>
      <div>
        <label htmlFor="venue-select">Select Venue: </label>
        <select id="venue-select" onChange={handleVenueChange}>
          <option value="">--Choose a Venue--</option>
          {venues.map((data, index) => (
            <option key={index} value={data.stadium}>
            {data.stadium}
          </option>          
          ))}
        </select>
      </div>
      {selectedVenue && (
        <div className="stats-container">
          <h2>{selectedVenue.stadium}</h2>
          <p>Total Matches: {selectedVenue.totalMatches}</p>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
}

export default VenueStats;
