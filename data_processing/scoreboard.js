

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
    get_score_data(team) {
        let teamId = 0;
        if (typeof team === 'string') {
            let matchingTeams = this.teams.filter(t => {
                return t.is_search_match(team);
            });
            if(matchingTeams.length == 0) {
                console.log("No team matches");
            } else if (matchingTeams.length > 1) {
                console.log("Multiple teams");
            } else {
                teamId = matchingTeams[0].id;
            }
        } else if (typeof team === 'number') {
            teamId = team;
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
                if(matchup.away.teamId === teamId)  {
                    team['score'] = matchup.away.totalPoints;
                    opp['score'] = matchup.home.totalPoints;
                } else if (matchup.home.teamId === teamId) {
                    team['score'] = matchup.home.totalPoints;
                    opp['score'] = matchup.away.totalPoints;
                }
                output.push(team)
                output.push(opp)
            }
        });
        return output;
    }
}

module.exports = {Scoreboard}