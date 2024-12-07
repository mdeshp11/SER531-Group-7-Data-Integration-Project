# SparQL Queries

venue_stats = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>

    SELECT ?stadium
           (COUNT(?match) AS ?totalMatches)
           (SUM(IF(?result = "runs", 1, 0)) AS ?battingFirstWins)
           (SUM(IF(?result = "wickets", 1, 0)) AS ?bowlingFirstWins)
           ((SUM(IF(?result = "runs", 1, 0)) * 100) / COUNT(?match)
           AS ?battingFirstWinPercentage)
           ((SUM(IF(?result = "wickets", 1, 0)) * 100) / COUNT(?match)
           AS ?bowlingFirstWinPercentage)
    WHERE {
      ?match smw:wasPlayedOn ?stadium ;
             smw:result ?result .
    }
    GROUP BY ?stadium
    ORDER BY ?stadium
    """

# batting_first = """
#     PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
#     PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

#     SELECT ?team ?battingFirstRuns
#     WHERE {
#         ?match smw:tossDecision "bat" ;
#         smw:tossWinner ?team ;
#         smw:targetRuns ?battingFirstRuns .
#     }
#     """

bowling_first = """
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?team ?bowlingFirstRuns
    WHERE {
        ?match smw:tossDecision "field" ;
        smw:wonBy ?team ;
        smw:targetRuns ?bowlingFirstRuns .
    }
    """



# PREFIX smw: <http://example.org/ipl/1.0.0/deliveries_one#>
# PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

# SELECT ?batter ?totalRuns (IF(?totalDeliveries > 0, (?totalRuns / ?totalDeliveries) * 100, 0) AS ?strikeRate)
# WHERE {
#   {
#     SELECT ?batter (SUM(?runs) AS ?totalRuns)
#     WHERE {
#       ?delivery smw:hasBatter ?batter ;
#                 smw:totalRuns ?runs .
#     }
#     GROUP BY ?batter
#   }
#   OPTIONAL {
#     SELECT ?batter (COUNT(?delivery) AS ?totalDeliveries)
#     WHERE {
#       ?delivery smw:hasBatter ?batter .
#     }
#     GROUP BY ?batter
#   }
# }
# ORDER BY DESC(?totalRuns) DESC(?strikeRate)

clutch_bowler = """
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?teamName ?bowler ?totalWickets
    WHERE {
    {
        SELECT ?bowler (COUNT(?delivery) AS ?totalWickets)
        WHERE {
        ?delivery smw:hasBowler ?bowler ;
                    smw:isWicket true ;
                    smw:overNumber ?over ;
                    smw:wasDeliveredIn ?match .
        FILTER (?over >= 15 && ?over <= 19)
        }
        GROUP BY ?bowler
    }
  
    ?player smw:hasPlayerName ?bowler ;
            smw:belongsToTeam ?teamName .
    }
    HAVING (?totalWickets >= 10) 
    ORDER BY DESC(?totalWickets)
"""

clutch_batsman = """
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?batter ?teamName ?totalRuns
        (IF(?totalDeliveries > 0, (?totalRuns / ?totalDeliveries) * 100, 0) AS ?strikeRate)
    WHERE {
    {
        SELECT ?batter (SUM(?runs) AS ?totalRuns)
        WHERE {
        ?delivery smw:hasBatter ?batter ;
                    smw:totalRuns ?runs ;
                    smw:overNumber ?over ;
      			    smw:wasDeliveredIn ?match . 
        FILTER (?over >= 15 && ?over <= 19)
        }
        GROUP BY ?batter
    }
    OPTIONAL {
        SELECT ?batter (COUNT(?delivery) AS ?totalDeliveries)
        WHERE {
        ?delivery smw:hasBatter ?batter ;
                    smw:overNumber ?over ;
                    smw:wasDeliveredIn ?match .
        FILTER (?over >= 15 && ?over <= 19)
        }
        GROUP BY ?batter
    }

    ?player smw:hasPlayerName ?batter ;
            smw:belongsToTeam ?teamName .
    }
    ORDER BY DESC(?totalRuns) DESC(?strikeRate)
    LIMIT 50
"""

clutch_fielder = """
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?fielder ?teamName (COUNT(?catchDelivery) AS ?catches) (COUNT(?runoutDelivery) AS ?runouts)
        (?catches + ?runouts AS ?totalContributions)
    WHERE {
    # Extract deliveries
    ?delivery smw:wasDeliveredIn ?match ;
                smw:hasFielder ?fielder ;
                smw:overNumber ?over ;
                smw:dismissalKind ?dismissal .
    FILTER (?over >= 15 && ?over <= 19)

    # Identify catches
    OPTIONAL {
        ?delivery smw:dismissalKind "caught" .
        BIND(?delivery AS ?catchDelivery)
    }

    # Identify runouts
    OPTIONAL {
        ?delivery smw:dismissalKind "run out" .
        BIND(?delivery AS ?runoutDelivery)
    }
  
    ?player smw:hasPlayerName ?fielder ;
            smw:belongsToTeam ?teamName .

    }
    GROUP BY ?teamName ?fielder
    ORDER BY DESC(?totalContributions)
"""
#average score batting first = """
#PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
#   PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
#    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
#    
#    SELECT ?team (ROUND(AVG(?adjustedTargetRuns)) AS ?averageScoreBattingFirst)
#    WHERE {
#      {
#        # Case 1: Team wins the toss and chooses to bat
#        ?match smw:tossWinner ?team;
#               smw:tossDecision "bat";
#               smw:targetRuns ?targetRuns.
#        FILTER(?targetRuns != "NA") # Exclude cases where targetRuns is "NA"
#        BIND(xsd:integer(?targetRuns) - 1 AS ?adjustedTargetRuns)
#      }
#      UNION
#      {
#        # Case 2: Team loses the toss but bats first
#        ?match smw:hasTeam1 ?team;
#               smw:tossWinner ?opponent;
#               smw:tossDecision "field";
#              smw:targetRuns ?targetRuns.
#        FILTER(?targetRuns != "NA") 
#        FILTER(?team != ?opponent) 
#        BIND(xsd:integer(?targetRuns) - 1 AS ?adjustedTargetRuns)
#      }
#   }
#    GROUP BY ?team
#    ORDER BY DESC(?averageScoreBattingFirst)
#       """

batting_first = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
   
    SELECT ?team (ROUND(AVG(?adjustedTargetRuns)) AS ?averageScoreBattingFirst)
    WHERE {
        {
        # Case 1: Team wins the toss and chooses to bat
        ?match smw:tossWinner ?team;
                smw:tossDecision "bat";
                smw:targetRuns ?targetRuns.
        FILTER(?targetRuns != "NA") # Exclude cases where targetRuns is "NA"
        BIND(xsd:integer(?targetRuns) - 1 AS ?adjustedTargetRuns)
        }
        UNION
        {
        # Case 2: Team loses the toss but bats first
        ?match smw:hasTeam1 ?team;
                smw:tossWinner ?opponent;
                smw:tossDecision "field";
                smw:targetRuns ?targetRuns.
        FILTER(?targetRuns != "NA") 
        FILTER(?team != ?opponent) 
        BIND(xsd:integer(?targetRuns) - 1 AS ?adjustedTargetRuns)
        }
    }
    GROUP BY ?team
    ORDER BY DESC(?averageScoreBattingFirst)
"""
player_dismissal = """
    PREFIX smw: <http://example.org/ipl/1.0.0/matches#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?player_dismissed ?teamName ?dismissalKind (COUNT(?delivery) AS ?dismissalCount)
    WHERE {
    # Retrieve player dismissal details
    ?delivery smw:hasPlayerDismissed ?player_dismissed ;
                smw:isWicket true ;
                smw:overNumber ?over ;
                smw:wasDeliveredIn ?match ;
                smw:dismissalKind ?dismissalKind .
            
    # Fetch team name for the dismissed player
    ?player smw:hasPlayerName ?player_dismissed ;
            smw:belongsToTeam ?teamName .
    }
    GROUP BY ?player_dismissed ?teamName ?dismissalKind
    ORDER BY ?player_dismissed DESC(?dismissalCount)
"""