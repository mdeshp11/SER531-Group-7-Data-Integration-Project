import React, { useState } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar chart
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import "./TeamAverage.css"; // Import updated CSS

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// Import PNG icons
const battingIcon = `${process.env.PUBLIC_URL}/bat.png`; // Replace with the actual path
const bowlingIcon = `${process.env.PUBLIC_URL}/cricket-ball.png`;

// Import team logos
const teamLogos = {
  "Chennai Super Kings": `${process.env.PUBLIC_URL}/CSK.png`, // Replace with actual paths
  "Punjab Kings": `${process.env.PUBLIC_URL}/PK.png`,
  "Delhi Capitals": `${process.env.PUBLIC_URL}/DC.png`,
  "Gujarat Titans": `${process.env.PUBLIC_URL}/GT.png`,
  "Kolkata Knight Riders": `${process.env.PUBLIC_URL}/KKR.png`,
  "Lucknow Super Giants": `${process.env.PUBLIC_URL}/LSG.png`,
  "Rajasthan Royals": `${process.env.PUBLIC_URL}/RR.png`,
  "Royal Challengers Bengaluru": `${process.env.PUBLIC_URL}/RCB.png`,
};

const sampleTeamData = {
  "Chennai Super Kings": {
    battingFirstRuns: "224",
    bowlingFirstRuns: "168",
  },
  "Deccan Chargers": {
    battingFirstRuns: "191",
    bowlingFirstRuns: "133",
  },
  "Delhi Capitals": {
    battingFirstRuns: "154",
    bowlingFirstRuns: "209",
  },
};

function TeamAverage() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamStats, setTeamStats] = useState(null);
  const [showLogo, setShowLogo] = useState(false); // State to control logo visibility

  const handleTeamChange = (event) => {
    const teamName = event.target.value;
    setSelectedTeam(teamName);
    setTeamStats(sampleTeamData[teamName] || null);

    // Trigger the logo animation
    setShowLogo(false);
    setTimeout(() => setShowLogo(true), 100); // Reset animation
  };

  const chartData = teamStats
    ? {
        labels: ["Batting First Runs", "Bowling First Runs"], // Labels without icons
        datasets: [
          {
            data: [
              parseInt(teamStats.battingFirstRuns),
              parseInt(teamStats.bowlingFirstRuns),
            ],
            backgroundColor: ["#32cd32", "#ffd700"], // Lime Green and Gold
            hoverBackgroundColor: ["#28a745", "#e5b800"], // Darker shades
            borderRadius: 10, // Rounded corners for bars
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remove the color legend
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // X-axis text color
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white", // Y-axis text color
          font: {
            size: 14,
          },
        },
      },
    },
  };

  // Plugin for rendering icons as labels
  const customIconsPlugin = {
    id: "custom-icons",
    afterDatasetsDraw(chart) {
      const { ctx, scales } = chart;
      const xAxis = scales.x;

      xAxis.ticks.forEach((_, index) => {
        const image = new Image();
        image.src = index === 0 ? battingIcon : bowlingIcon;

        const x = xAxis.getPixelForTick(index);
        const y = chart.chartArea.bottom + 20; // Position below the x-axis

        ctx.drawImage(image, x - 80, y - 10, 20, 20); // Adjust icon size and position
      });
    },
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
          <div className="chart-container">
            <Bar
              data={chartData}
              options={chartOptions}
              plugins={[customIconsPlugin]} // Add the custom plugin
            />
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
