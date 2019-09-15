const Roster = require('./players.js').Roster

/** 
 * A class representing an owner of a team
 * @class 
 */
class Owner {
    /**
     * @constructor
     * @param {object} data Data from the `members` property of the  `mTeam` API response
     * @property {int} league_id LeagueId
     * @property {string} firstName First name of the owner
     * @property {string} lastName Last name of the owner
     */
    constructor(data) {
        this.league_id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fullName = () => {
            return this.firstName + " " + this.lastName;
        }
    }
}

/** 
 * A class representing a team, including any Owners and team properties
 * @class 
 */
class Team {
    /**
     * @constructor
     * @param {object} data Data from the `members` property of the  `mTeam` API response
     * @param {object} team Data from an element of the `teams` array of the `mTeam` API response
     * @property {Owner[]} owners Array of Owner class objects
     * Note that there are additonal properties from the `team` parameter that are added. Will fill in later
     */
    constructor(owners, team) {
        //Add owners
        this.owners = [];
        let teamOwners = owners.filter(o => {
            return team.owners.includes(o.id);
        });
        teamOwners.forEach(element => {
            this.owners.push(new Owner(element));
        });
        //Add team data, omitting some large unnecessary properties
        const omittedKeys = ['owners','draftStrategy', 'valuesByStat']
        for(let key in team) {
            if (!omittedKeys.includes(key)) {
                this[key] = team[key];
            }
        }
        this.fullTeamName = () => {
            return this.location + " " + this.nickname;
        }
    }

    /**
     * Method to get the names of all owners for this team
     * 
     * @returns {string} String corresponding to comma separated list of owner names
     */
    get_owner_names() {
        let output = []
        this.owners.forEach(owner => {
            output.add(owner.fullName());
        });
        return output.join(",");
    }

    /**
     * Method to get various useful information for display
     * 
     * @returns {object} Object containing properties including team name, owner names, and url of team logo
     */
    get_display_info() {
        return {
            teamName: this.fullTeamName(),
            owners: this.get_owner_names(),
            logo: this.logo
        }
    }

    /**
     * Method to take a search string parameter and see if it matches common team values, including owner names or
     * team names
     * 
     * @param {string} input String to search for
     * @returns {boolean} Boolean indicating if team matches input expression
     */
    is_search_match(input) {
        //Check owner names
        let result = false;
        this.owners.forEach(owner => {
            if(owner.fullName().match(new RegExp(input, 'i'))) {
                result = true;
            }
        })
        //Check team name
        return result || this.fullTeamName().match(new RegExp(input, 'i')) !== null;
    }
}

module.exports = {Owner, Team}