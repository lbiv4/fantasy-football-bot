

class Scoreboard {

    /**
     * Constructor 
     * 
     * @param {Array} teams Array of team data from API request 
     * @param {Array} schedule Array of schedule data from API request
     * @param {int=} scoringPeriod Week of scoreboard to focus on. Defaults to all weeks
     */
    constructor(teams, schedule, scoringPeriod) {
        this.teams = teams;
        this.schedule = schedule.filter(matchup => {
            if(scoringPeriod) {
                return matchup.scoringPeriodId == scoringPeriod;
            } else {
                return true;
            }
        });
    }

    /**
     * 
     * @param {(string|number)} team String or id 
     */
    get_score(team) {
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
        } else if (typeof team === int) {
            teamId = team;
        } else {
            console.log("error - cannot identify team");
        }
    }
}