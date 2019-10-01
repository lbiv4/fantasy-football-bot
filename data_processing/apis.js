const config = require('../config/config.json');
const axios = require('axios');
const Owner = require('./team.js').Owner;
const Team = require('./team.js').Team;
const FantasyScoreboard = require('./scoreboard.js').FantasyScoreboard;
const NFLTeams = require('./scoreboard.js').NFLTeams;
const Roster = require('./players.js').Roster;


/**
 * Method to create cookies based on passed in key-value pairs and league privacy
 * @param {Object<JSON>} keyValuePairs Json representing additional key-value pairs to add 
 */
const get_cookies = (keyValuePairs) => {
    let output = "";
    //Add private auth
    if(config.league_private) {
        output += `espn_s2=${config.espn_s2}; SWID=${config.swid}; espn_auth=${config.espn_auth};`;
    }
    //Add other desired cookies
    for(key in keyValuePairs) {
        output += `${key}=${keyValuePairs[key]};`
    }
    return output;
}

/**
 * Helper method to run any API call and produce the response data
 * @param {*} url URL for the request
 * @param {*} headers Headers for the request
 * @param {*} params Query parameters for the request
 */
async function get_data(url, headers, params) {
    const options = {
        method: 'get',
        url: url,
        params: params,
        headers: headers || {'cookie': get_cookies()},
        responseType: 'json'
    }
   return await axios(options)
        .then((resp) => {
            return resp.data;
        })
        .catch((err) => {
            console.log(`Error processing request: ${err}`);
            return null;
        })
}

/**
 * Helper function to map ESPN's int values for position slots to their string representation
 * @param {int} slotId 
 * @returns {string} String representation of the input slot id
 */
const slotIdToPos = (slotId) => {
    const map = {
        0: "QB",
        2: "RB",
        3: "RB/WR",
        4: "WR",
        6: "TE",
        16: "D/ST",
        17: "K",
        20: "BE",
        23: "FLEX"
    }
    return map[slotId];
}

/**
 * Method to get week of current year
 * @param {int} year Year to look for current week
 * @returns {Promise<number>} Returns an integer value corresponding to current scoring period
 */
const get_scoring_period = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${config.league_id}`
    const views = ["mTeam"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (!output) {
        console.log("Cannot find data for year " + year)
        return null
    } else {
        return output.scoringPeriodId;
    }
}

/**
 * Method to get owner information
 * @param {int} year Year to look for owners
 * @returns {Promise<Owner[]>} Returns an array of owners in the league
 */
const get_owners = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${config.league_id}`
    const views = ["mTeam"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (!output) {
        console.log("Cannot find owner data for year " + year)
        return null
    } else {
        let owners = []
        for(let i = 0; i < output.members.length; i++) {
            owners.push(new Owner(output.members[i]));
        }
        return owners;
    }
}

/**
 * Method to get team rosters
 * @param {int} year Year to look for teams
 * @return {Promise<Team[]>} Returns an array of Rosters in the league for the input year
 */
const get_rosters = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${config.league_id}`
    const views = ["mRoster"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (!output) {
        console.log("Cannot find roster data for year " + year)
        return null;
    } else {
        let rosters = []
        for(let i = 0; i < output.teams.length; i++) {
            rosters.push(new Roster(output.teams[i].id, output.teams[i].roster));
        }
        return rosters;
    }
}

/**
 * Method to get team information
 * @param {int} year Year to look for teams
 * @return {Promise<Team[]>} Returns an array of teams in the league for the input year
 */
const get_teams = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${config.league_id}`
    const views = ["mTeam"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (!output) {
        console.log("Cannot find team data for year " + year)
        return null;
    } else {
        const rosters = await get_rosters(year);
        let teams = []
        for(let i = 0; i < output.teams.length; i++) {
            teams.push(new Team(output.members, rosters[i], output.teams[i]));
        }
        return teams;
    }
}

/**
 * Method to get fantasy scoreboard information
 * @param {int} year Year of scoreboard
 * @param {int=} week Optional parameter to indicate which week of the scoreboard to use. Defaults to current scoring period
 */
const get_fantasy_scoreboard = async (year, week) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${config.league_id}`
    const views = ["mMatchupScore"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    const scoringPeriod = week || output.scoringPeriodId;
    if (!output) {
        console.log("Cannot find data for year " + year)
        return null;
    } else {
        const teams = await get_teams(year);
        return new FantasyScoreboard(teams, output.schedule, scoringPeriod);
    }
}

/**
 * Method to get NFL team information for a given year
 */
const get_nfl_teams = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}`
    const views = ["proTeamSchedules_wl"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (!output) {
        console.log("Cannot find NFL scoreboard for date " + new Date())
        return null;
    } else {
        return new NFLTeams(output.settings);
    }
}

/**
 * Method to get all 'inactive' (injured (questionable or worse) and on bye week players) starters for all fantasy teams
 * Note that a player may actually be active by game time - accounts for questionable or doubtful starters who may become inactive
 * @param {number} year 
 * @param {number} week 
 * @returns Object containing a `team` parameter corresponding to a `Team` class object and an `inactivePlayers`
 *          parameter corresponding to an array of inactive starters
 */
const get_inactive_starters = async (year, week) => {
    const fantasyTeams = await get_teams(year);
    const nflTeams = await get_nfl_teams(year);
    let output = [];
    fantasyTeams.forEach(fTeam => {
        let injuredOrBye = fTeam.roster.players.filter(plr => {
            let onBye = false;
            let playerTeam = nflTeams.get_team_by_player(plr);
            if(playerTeam !== null) {
                onBye = playerTeam.byeWeek === week;
            }
            return plr.is_starter() && (plr.is_injured() || onBye);
        })
        if(injuredOrBye.length > 0) {
            output.push({team: fTeam, inactivePlayers: injuredOrBye});
        }
    })
    return output;
}



//Test method not for use
const test = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${config.league_id}`
    //const views = ["modular", "mNav", "mMatchupScore", "mRoster", "mScoreboard", "mSettings", "mTopPerformers", "mTeam", "mPositionalRatings", "kona_player_info", "proTeamSchedules_wl"];
    const views = ["mTeam"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (!output) {
        console.log("Cannot find team data for year " + year)
        return null;
    } else {
        //keyTypes(output, views[0], 0)
        return output
    }
}

//Test method not for use
const keyTypes = (val, name, count) => {
    const print = (name, type) => {
        tabs = " ".repeat(count*4)
        console.log(`${tabs}${name}: ${type}`)
    }
    if(val == null) {
        return;
    } else if(typeof val === 'object') {
        if (Array.isArray(val)) {
            print(name, 'array', count)
            return keyTypes(val[0], 'ArrayObj', count+1)
        } else {
            print(name, 'object', count)
            Object.getOwnPropertyNames(val).forEach(prop => {
                keyTypes(val[prop], prop, count+1)
            })
        }
    } else {
        print(name, typeof val)
    }
}

module.exports = {get_scoring_period, get_owners, get_teams, get_rosters, get_fantasy_scoreboard, get_nfl_teams, get_inactive_starters, test}

