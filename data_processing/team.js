

class Owner {
    constructor(data) {
        this.league_id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fullName = () => {
            return this.firstName + " " + this.lastName;
        }
    }
}

class Team {
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

    get_owners() {
        let output = "";
        this.owners.forEach(owner => {
            output += `,${owner.fullName()}`
        });
        return output.substring(1);
    }

    get_display_info() {
        return {
            teamName: this.fullTeamName(),
            owners: this.get_owners(),
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