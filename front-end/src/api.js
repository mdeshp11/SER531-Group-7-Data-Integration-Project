import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5000/api";

// Fetch Venue Stats
export const fetchVenueStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sparql/venue_stats`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue stats:", error);
    throw error;
  }
};

// Generic SPARQL Query
export const sendSparqlQuery = async (query) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, { query });
    return response.data;
  } catch (error) {
    console.error("Error sending SPARQL query:", error);
    throw error;
  }
};
