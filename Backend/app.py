from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Replace with your Fuseki SPARQL endpoint
FUSEKI_ENDPOINT = "http://localhost:8080/ipl-server/sparql"

@app.route('/api/query', methods=['POST'])
def sparql_query():
    query = request.json.get('query')
    headers = {'Content-Type': 'application/sparql-query'}
    try:
        # Send the SPARQL query to the Fuseki endpoint
        response = requests.post(FUSEKI_ENDPOINT, data=query, headers=headers)
        response.raise_for_status()  # Raise an error for HTTP errors
        return jsonify({'results': response.json()})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 400
    
def execute_sparql_query(query):
    headers = {'Content-Type': 'application/sparql-query'}
    try:
        response = requests.post(os.getenv('FUSEKI_URL'), data=query, headers=headers)
        response.raise_for_status()
        return response.json()  # Adjust based on Fuseki's response format
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}, 400
    
@app.route('/api/sparql/venue_stats', methods=['GET'])
def match_statistics_route():
    query = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>

    SELECT ?stadium 
           (COUNT(?match) AS ?totalMatches)
           (SUM(IF(?result = "runs", 1, 0)) AS ?battingFirstWins)
           (SUM(IF(?result = "wickets", 1, 0)) AS ?bowlingFirstWins)
           ((SUM(IF(?result = "runs", 1, 0)) * 100) / COUNT(?match) AS ?battingFirstWinPercentage)
           ((SUM(IF(?result = "wickets", 1, 0)) * 100) / COUNT(?match) AS ?bowlingFirstWinPercentage)
    WHERE {
      ?match smw:wasPlayedOn ?stadium ;
             smw:result ?result .
    }
    GROUP BY ?stadium
    ORDER BY ?stadium
    """
    
    result = execute_sparql_query(query)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
