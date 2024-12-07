from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os
from queries import (
    venue_stats,
    bowling_first,
    batting_first,
    clutch_bowler,
    clutch_batsman,
    clutch_fielder,
    player_dismissal,
)

app = Flask(__name__)
CORS(app, origins="*")

# Main function to call the fuseki api server
def execute_sparql_query(query):
    headers = {"Content-Type": "application/sparql-query"}
    try:
        response = requests.post(os.getenv("FUSEKI_URL"), data=query,
                                 headers=headers)

        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}, 400


# Venue Statistics API
@app.route("/api/ipl_server", methods=["GET"])
def venue_statistics():

    result = execute_sparql_query(venue_stats)

    if "error" in result:
        return jsonify({"error": result["error"]}), 400

    # Format the results
    formatted_results = []
    for binding in result.get("results", {}).get("bindings", []):
        formatted_results.append(
            {
                "stadium": binding["stadium"]["value"],
                "totalMatches": int(binding["totalMatches"]["value"]),
                "battingFirstWins": int(binding["battingFirstWins"]["value"]),
                "bowlingFirstWins": int(binding["bowlingFirstWins"]["value"]),
                "battingFirstWinPercentage": float(
                    binding["battingFirstWinPercentage"]["value"]
                ),
                "bowlingFirstWinPercentage": float(
                    binding["bowlingFirstWinPercentage"]["value"]
                ),
            }
        )

    return jsonify(formatted_results)


# Team Stats API
# TODO: Review query once
@app.route("/api/ipl_server/team_stats", methods=["GET"])
def team_stats():
    # Fetch bowling stats
    # print('Bowling: ', get_bowling_stats())
    # bowling_stats = get_bowling_stats()
    # if "error" in bowling_stats:
    #     return jsonify({"bowl_error": bowling_stats["error"]}), 400

    # Fetch batting stats
    # print('Batting: ', get_batting_stats())
    batting_stats = get_batting_stats()
    if "error" in batting_stats:
        return jsonify({"bat_error": batting_stats["error"]}), 400

    # Merge bowling and batting stats
    formatted_data = {}
    # all_teams = set(bowling_stats.keys()).union(batting_stats.keys())

    # print('ALL_teams: ', all_teams)

    # for team in all_teams:
    #     formatted_data[team] = {
    #         "battingSecondAverage": bowling_stats.get(team, 0),
    #         "battingFirstAverage": batting_stats.get(team, 0)
    #     }

    for team, batting_first_average in batting_stats.items():
        formatted_data[team] = {
            "averageScoreBattingFirst": batting_first_average}

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
        batting_data[team] = binding["averageScoreBattingFirst"]["value"]
    return batting_data


# clutch players API
@app.route("/api/ipl_server/clutch_players", methods=["GET"])
def clutch_players():
    # Getting Clutch bowlers
    bowlers = clutch_bowlers()

    # Getting clutch batsmen
    batsmen = clutch_batsmen()

    # Getting clutch fielders
    fielders = clutch_fielders()

    merged_data = {}

    # Combining all the players team wise
    for team in {**bowlers, **batsmen, **fielders}:
        merged_data[team] = {
            "batsmen": {
                player["batsmen"]: {
                    "totalRuns": player["totalRuns"],
                    "strikeRate": player["strikeRate"],
                }
                for player in batsmen.get(team, [])
            },
            "bowlers": {
                player["bowler"]: {"totalWickets": player["totalWickets"]}
                for player in bowlers.get(team, [])
            },
            "fielders": {
                player["fielder"]: {
                    "catches": player["catches"],
                    "runouts": player["runouts"],
                    "totalContributions": player["totalContributions"],
                }
                for player in fielders.get(team, [])
            },
        }

    return merged_data


# Helper function to get the clutch bowlers
def clutch_bowlers():
    # fetch players
    result = execute_sparql_query(clutch_bowler)
    if "error" in result:
        return {"error:", result["error"]}

    # print('Bowlers result', result)
    formatted_bowler = {}

    for binding in result.get("results", {}).get("bindings", []):
        team = binding["teamName"]["value"]
        bowler = binding["bowler"]["value"]
        totalWickets = binding["totalWickets"]["value"]

        if team not in formatted_bowler:
            formatted_bowler[team] = []

        formatted_bowler[team].append({"bowler": bowler,
                                       "totalWickets": totalWickets})

    return formatted_bowler


# Helper function to get the clutch batsmen
def clutch_batsmen():
    result = execute_sparql_query(clutch_batsman)
    if "error" in result:
        return {"error:", result["error"]}

    # print('Batsmen result', result)
    formatted_batsmen = {}

    for binding in result.get("results", {}).get("bindings", []):
        team = binding["teamName"]["value"]
        batter = binding["batter"]["value"]
        totalRuns = binding["totalRuns"]["value"]
        strikeRate = binding["strikeRate"]["value"]

        if team not in formatted_batsmen:
            formatted_batsmen[team] = []

        formatted_batsmen[team].append(
            {"batsmen": batter, "totalRuns": totalRuns,
             "strikeRate": strikeRate}
        )

    return formatted_batsmen


# Helper function to get the clutch fielders
def clutch_fielders():
    result = execute_sparql_query(clutch_fielder)
    if "error" in result:
        return {"error:", result["error"]}

    # print('Fielders result', result)
    formatted_fielders = {}

    for binding in result.get("results", {}).get("bindings", []):
        team = binding["teamName"]["value"]
        fielder = binding["fielder"]["value"]
        totalContributions = binding["totalContributions"]["value"]
        catches = binding["catches"]["value"]
        runouts = binding["runouts"]["value"]

        if team not in formatted_fielders:
            formatted_fielders[team] = []

        formatted_fielders[team].append(
            {
                "fielder": fielder,
                "totalContributions": totalContributions,
                "catches": catches,
                "runouts": runouts,
            }
        )

    return formatted_fielders


# Player Dismissal API
@app.route("/api/ipl_server/player_dismissals", methods=["GET"])
def player_dismissals():
    result = execute_sparql_query(player_dismissal)
    if "error" in result:
        return {"error:", result["error"]}

    player_data = {}

    for binding in result.get("results", {}).get("bindings", []):
        player = binding["player_dismissed"]["value"]
        dismissalKind = binding["dismissalKind"]["value"]
        dismissalCount = int(binding["dismissalCount"]["value"])

        if player not in player_data:
            player_data[player] = {}

        player_data[player][dismissalKind] = dismissalCount

    return player_data


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
