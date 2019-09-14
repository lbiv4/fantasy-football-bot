

class Scoreboard {
    /**
     * Constructor 
     * 
     * @param {Team[]} teams Array of team data from API request 
     * @param {object[]} schedule Array of schedule data from API request
     * @param {int=} scoringPeriod Week of scoreboard to focus on. Defaults to all weeks
     */
    constructor(teams, schedule, scoringPeriod) {
        this.teams = teams;
        this.schedule = schedule.filter(matchup => {
            if(scoringPeriod) {
                return matchup.matchupPeriodId == scoringPeriod;
            } else {
                return true;
            }
        });
    }

    _get_team(id) {
        return this.teams.filter(t => {
            return t.id === id
        })[0]
    }

    /**
     * Method to get score data on a team and their opponent in the scoreboard.
     * 
     * @param {(string|number)} team String or id to identify team to search for
     */
    get_score_data(teamIdentifier) {
        let teamId = 0;
        if (typeof teamIdentifier === 'string') {
            let matchingTeams = this.teams.filter(t => {
                return t.is_search_match(teamIdentifier);
            });
            if(matchingTeams.length == 0) {
                console.log("No team matches");
            } else if (matchingTeams.length > 1) {
                console.log("Multiple teams");
            } else {
                teamId = matchingTeams[0].id;
            }
        } else if (typeof teamIdentifier === 'number') {
            teamId = teamIdentifier;
        } else {
            console.log("error - cannot identify team");
            return null;
        }
        let output = [];
        this.schedule.forEach(matchup => {
            if(matchup.away.teamId === teamId || matchup.home.teamId === teamId) {
                let team = this._get_team(teamId).get_display_info();
                let oppId = matchup.away.teamId === teamId ? matchup.home.teamId : matchup.away.teamId;
                let opp = this._get_team(oppId).get_display_info();
                let homeScore = this._get_score_for_team(matchup.home);
                let awayScore = this._get_score_for_team(matchup.away);
                if(matchup.away.teamId === teamId)  {
                    team['score'] = awayScore;
                    opp['score'] = homeScore;
                } else if (matchup.home.teamId === teamId) {
                    team['score'] = homeScore;
                    opp['score'] = awayScore;
                }
                output.push(team)
                output.push(opp)
            }
        });
        return output;
    }

    /**
     * Helper function to get the score for a team in a matchup 
     * @param {Object} team Object corresponding to the home/away property of element in schedule (e.g. this.schedule[i].away)
     * @return Number representing score for input team
     */
    _get_score_for_team(team) {
        if(team.rosterForCurrentScoringPeriod === undefined) {
            return team.totalPoints;
        } else {
            return team.rosterForCurrentScoringPeriod.appliedStatTotal.toFixed(1);
        }
    }
}

module.exports = {Scoreboard}