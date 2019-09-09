

class Scoreboard {

    /**
     * Constructor 
     * 
     * @param {Array} teams Array of team data from API request 
     * @param {Array} schedule Array of schedule data from API request
     * @param {int?} scoringPeriod Week of scoreboard to focus on. Defaults to all weeks
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

    get_score(team) {
        let team_id = 0;
        if (typeof team === 'string') {
            team_id = this.team.filter(t => {
                return t.id == team;
            }).id;
        } else if (typeof team === int) {
            team_id = team;
        } else {
            console.log("error - cannot identify team");
        }
    }
}