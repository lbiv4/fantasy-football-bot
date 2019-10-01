/** 
 * A class representing scores for the fantasy league
 * @class 
 */
class FantasyScoreboard {
    /**
     * @constructor 
     * @param {Team[]} teams Array of team data from API request 
     * @param {object[]} schedule Array of schedule data from API request
     * @param {int=} scoringPeriod Week of scoreboard to focus on. Defaults to all weeks
     * @property {Team[]} teams Array of Team objects
     * @property {object[]} schedule Array of matchup data, filtered on the `scoringPeriod` parameter is it exists 
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

    /**
     * Helper method to get a Team object by an ide
     * @param {int} id 
     * @returns {Team} Team object corresponding to the input id
     */
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

/** 
 * A class representing data on NFL teams and their schedules
 * @class 
 */
class NFLTeams {
    constructor(scoreboardData) {
        this.firstGameDate = new Date(scoreboardData.playerOwnershipSettings.firstGameDate);
        this.lastGameDate = new Date(scoreboardData.playerOwnershipSettings.lastGameDate);
        this.proTeams = scoreboardData.proTeams;
    }

    get_team_by_player(player) {
        let teams = this.proTeams.filter(team => {
            return team.id === player.proTeamId;
        });
        if(teams.length > 0) {
            return teams[0];
        } else {
            console.log("Cannot find team for player " + player.fullName);
            return null;
        }
    }

    /**
     * Method to get a Date object representing the time of the matchup for the input team
     * @param {(string|number)} teamIdentifier String or numeric id corresponding to input team
     * @param {int} week Week of matchup (1-17)
     */
    get_matchup_datetime(teamIdentifier, week) {
        let teamId = 0;
        let teams;
        if (week < 1 || week > 17) {
            console.log("Cannot search for matchup date/time outside of weeks 1-17")
            return null;
        }
        else if (typeof teamIdentifier === 'string') {
            teams = this.proTeams.filter(t => {
                let matches = [t.abbrev.toUpperCase(),
                                t.location.toUpperCase(),
                                t.name.toUpperCase()]
                return matches.includes(teamIdentifier.toUpperCase());
            });
        } else if (typeof teamIdentifier === 'number') {
            teams = this.proTeams.filter(t => {
                return t.id === teamIdentifier
            });
        } else {
            console.log("Error - cannot identify team with input=" + teamIdentifier);
            return null;
        }
        if(teams.length == 0) {
            console.log("No matching team with id " + teamId);
            return null;
        } else {
            let dateInMillis = teams[0].proGamesByScoringPeriod[week][0].date;
            return new Date(dateInMillis);
        }
    }
}

module.exports = {FantasyScoreboard, NFLTeams}