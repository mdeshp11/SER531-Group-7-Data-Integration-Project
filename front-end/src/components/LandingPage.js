import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Ensure the CSS is linked

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <img
        src={`${process.env.PUBLIC_URL}/IPL Insights.png`} // Add your image in the public folder
        alt="IPL Insights"
        className="landing-image"
      />
      <div className="features">
        <div className="left-buttons">
          <button onClick={() => navigate("/venue")} className="feature-btn">
            Venues
          </button>
          <button onClick={() => navigate("/feature2")} className="feature-btn">
            Feature 2
          </button>
        </div>
        <div className="right-buttons">
          <button onClick={() => navigate("/feature3")} className="feature-btn">
            Feature 3
          </button>
          <button onClick={() => navigate("/feature4")} className="feature-btn">
            Feature 4
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
