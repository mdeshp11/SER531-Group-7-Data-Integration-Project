import React, { useState, /*useEffect */} from "react";
// import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./VenueStats.css"; // Import the CSS file

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

//BACKEND URL
// const backendURL = 'http://127.0.0.1:5050'

const sampleVenueData = [
  {
    battingFirstWinPercentage: 53.333333333333336,
    battingFirstWins: 16,
    bowlingFirstWinPercentage: 43.333333333333336,
    bowlingFirstWins: 13,
    stadium: "Arun Jaitley Stadium",
    totalMatches: 30,
  },
  {
    battingFirstWinPercentage: 57.142857142857146,
    battingFirstWins: 4,
    bowlingFirstWinPercentage: 42.857142857142854,
    bowlingFirstWins: 3,
    stadium: "Barabati Stadium",
    totalMatches: 7,
  },
];

function VenueStats() {
  const [venues] = useState(sampleVenueData); // Ensure this is properly used
  // const [venues, setVenues] = useState([]); // State to store venue data from API
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Fetch data from API on component mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(backendURL + '/api/ipl_server');
  //       if (response.data.error) {
  //         console.error("Backend Error:", response.data.error);
  //         return;
  //       }
  //       console.log("API Response:", response.data);
  //       setVenues(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data from API:", error.message);
  //     }
  //   };
    

  //   fetchData();
  // }, []);

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
            backgroundColor: ["#32cd32", "#ffd700"], // Lime Green and Gold
            hoverBackgroundColor: ["#28a745", "#e5b800"], // Darker Lime Green and Orange
          },
        ],
      }
    : null;

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#d4d2d2", // Set legend text color
        },
      },
    },
  };

    return (
      <div className="venue-container">
        <h1 className="venue-header">Venue Statistics</h1>
        <div className="dropdown-container">
          <select
            id="venue-select"
            className="venue-select"
            onChange={handleVenueChange}
          >
            <option value="">Select a Venue</option>
            {venues.map((data, index) => (
              <option key={index} value={data.stadium}>
                {data.stadium}
              </option>
            ))}
          </select>
        </div>
        {selectedVenue && (
          <div className="stats-container">
            <h2 className="venue-name">{selectedVenue.stadium}</h2>
            <p className="venue-matches">
              Total Matches: <span>{selectedVenue.totalMatches}</span>
            </p>
            <div className="chart-container">
            <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    );          
}

export default VenueStats;
