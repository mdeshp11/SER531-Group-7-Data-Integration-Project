from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from queries import venue_stats

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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)
