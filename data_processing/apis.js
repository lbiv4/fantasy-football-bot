const config = require('../config/config.json');
const axios = require('axios');

/**
 * Method to create cookies based on passed in key-value pairs and league privacy
 * @param {*} keyValuePairs Json representing additional key-value pairs to add 
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
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(`Error processing request: ${err}`);
            return null;
        })
}

const get_scoreboard = async (year, scoringPeriod) => {
    const uri = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/454525`
    //const views = ["modular", "mNav", "mMatchupScore", "mRoster", "mScoreboard", "mSettings", "mTopPerformers", "mTeam"];
    const views = ["mMatchupScore"]
    const data = {
        scoringPeriod: scoringPeriod,
        view: views.join(",")
    }
    const output = await get_data(uri, null, data);
    if (output) {
        console.log(output.data)
    }
}

module.exports = {get_scoreboard}

