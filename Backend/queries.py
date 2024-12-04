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