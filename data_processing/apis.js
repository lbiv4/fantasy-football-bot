const config = require('../config/config.json');
const axios = require('axios');

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
 * Method to get scoreboard information
 * @param {int} year 
 * @param {int?} scoringPeriod 
 */
const get_scoreboard = async (year, scoringPeriod) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/454525`
    //const views = ["modular", "mNav", "mMatchupScore", "mRoster", "mScoreboard", "mSettings", "mTopPerformers", "mTeam", "mPositionalRatings", "kona_player_info"];
    const views = ["mScoredboard"]
    const data = {
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    const scoringPeriod = scoringPeriod || output.scoringPeriodId;
    if (!output) {
        console.log("Cannot find data for year " + year)
    } else {
        console.log("Found data");
    }
}

module.exports = {get_scoreboard}

