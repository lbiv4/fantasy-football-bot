

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
        console.log(teamOwners);
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
}

module.exports = {Owner, Team}