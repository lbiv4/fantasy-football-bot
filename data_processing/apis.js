const config = require('../config/config.json');
const axios = require('axios');
const Owner = require('./team.js').Owner;
const Team = require('./team.js').Team;
const Scoreboard = require('./scoreboard.js').Scoreboard;

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
 * Method to get owner information
 * @param {int} year Year to look for owners
 * @returns {Promise<Owner[]>} Returns an array of owners in the league
 */
const get_owners = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/454525`
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
 * Method to get team information
 * @param {int} year Year to look for teams
 * @return {Promise<Team[]>} Returns an array of teams in the league for the input year
 */
const get_teams = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/454525`
    const views = ["mTeam"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (!output) {
        console.log("Cannot find team data for year " + year)
        return null;
    } else {
        let teams = []
        for(let i = 0; i < output.teams.length; i++) {
            teams.push(new Team(output.members, output.teams[i]));
        }
        return teams;
    }
}

/**
 * Method to get scoreboard information
 * @param {int} year Year of scoreboard
 * @param {int=} week Optional parameter to indicate which week of the scoreboard to use. Defaults to current scoring period
 */
const get_scoreboard = async (year, week) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/454525`
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
        return new Scoreboard(teams, output.schedule, scoringPeriod);
    }
}

//Test method not for use
const test = async (year) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/454525`
    //const views = ["modular", "mNav", "mMatchupScore", "mRoster", "mScoreboard", "mSettings", "mTopPerformers", "mTeam", "mPositionalRatings", "kona_player_info"];
    const views = ["mScoreboard"]
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

module.exports = {get_owners, get_teams, get_scoreboard, test}

