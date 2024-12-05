from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from queries import venue_stats, bowling_first, batting_first

app = Flask(__name__)
CORS(app, origins='*')

# Main function to call the fuseki api server
def execute_sparql_query(query):
    headers = {'Content-Type': 'application/sparql-query'}
    try:
        response = requests.post(
            os.getenv('FUSEKI_URL'),
            data=query,
            headers=headers)

        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}, 400

# Venue Statistics API
@app.route('/api/ipl_server', methods=['GET'])
def venue_statistics():

    result = execute_sparql_query(venue_stats)
    
    if "error" in result:
        return jsonify({"error": result["error"]}), 400

    # Format the results
    formatted_results = []
    for binding in result.get("results", {}).get("bindings", []):
        formatted_results.append({
            "stadium": binding["stadium"]["value"],
            "totalMatches": int(binding["totalMatches"]["value"]),
            "battingFirstWins": int(binding["battingFirstWins"]["value"]),
            "bowlingFirstWins": int(binding["bowlingFirstWins"]["value"]),
            "battingFirstWinPercentage": float(binding["battingFirstWinPercentage"]["value"]),
            "bowlingFirstWinPercentage": float(binding["bowlingFirstWinPercentage"]["value"]),
        })

    return jsonify(formatted_results)

# Team Stats API
@app.route('/api/ipl_server/team_stats', methods=['GET'])
def team_stats():
    # Fetch bowling stats
    print('Bowling: ', get_bowling_stats())
    bowling_stats = get_bowling_stats()
    if "error" in bowling_stats:
        return jsonify({"bowl_error": bowling_stats["error"]}), 400

    # Fetch batting stats
    # print('Batting: ', get_batting_stats())
    batting_stats = get_batting_stats()
    if "error" in batting_stats:
        return jsonify({"bat_error": batting_stats["error"]}), 400

    # Merge bowling and batting stats
    formatted_data = {}
    all_teams = set(bowling_stats.keys()).union(batting_stats.keys())

    # print('ALL_teams: ', all_teams)

    for team in all_teams:
        formatted_data[team] = {
            "battingSecondAverage": bowling_stats.get(team, 0),  
            "battingFirstAverage": batting_stats.get(team, 0)
        }

    return jsonify(formatted_data)

def get_bowling_stats():
    """Fetch and format bowling stats."""
    result = execute_sparql_query(bowling_first)
    if "error" in result:
        return {"error": result["error"]}
    
    bowling_data = {}
    for binding in result.get("results", {}).get("bindings", []):
        team = binding["team"]["value"]
        bowling_data[team] = binding["bowlingFirstRuns"]["value"]
    return bowling_data

def get_batting_stats():
    """Fetch and format batting stats."""
    result = execute_sparql_query(batting_first)
    if "error" in result:
        return {"error": result["error"]}
    
    batting_data = {}
    for binding in result.get("results", {}).get("bindings", []):
        team = binding["team"]["value"]
        batting_data[team] = binding["battingFirstRuns"]["value"]
    return batting_data

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)
