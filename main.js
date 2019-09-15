const apis = require('./data_processing/apis');
//const bot = require('./integrations/discord_bot.js');

apis.get_scoreboard(2019, 1).then(output => {
    console.log(output.schedule)
});

/*
apis.get_teams(2019).then(output => {
    console.log(output[0])
})*/
