const Discord = require('discord.js');
const config = require('../config/config.json');
const api = require('../data_processing/apis.js');
// Configure logger settings

// Hello World!
const bot = new Discord.Client();
bot.on('ready', function (evt) {
    console.log('Ready')
});
bot.on('message', msg => {
    //console.log(msg);
    if(!msg.author.bot && msg.isMentioned(config.bot_id)) {
        const tokens = msg.cleanContent.replace(/\s+/g, " ").split(" ");
        console.log(tokens)
        if(tokens[1].toLowerCase() == "help") {
            let message;
            let messageTimeBeforeDelete = 30000;
            if(tokens.length <= 2) {
                message = `Command options (use 'help <command>' for more details):
                \tscoreboard`;
            } else {
                switch(tokens[2].toLowerCase()) {
                    case "scoreboard":
                        message = `Command options for 'scoreboard':
                        \tscoreboard <week> <owner> - Get score for given week and term matching owner or team name (can be partial name)
                        \t\tEx: scoreboard 1 Joe
                        \t\tEx: scoreboard 13 MyTeam`
                        break;
                    default:
                        message = `Sorry, help for command ${tokens[0].toLowerCase()} not recognized.`
                        break;
                }
            }
            message += `\nThis message will be deleted in ${messageTimeBeforeDelete/1000} seconds`;
            msg.channel.send(message)
                    .then(sent => {
                        sent.delete(messageTimeBeforeDelete);
                    })
        } else if(tokens[1].toLowerCase() == "scoreboard") {
            let week = null;
            let searchTerm = null;
            for(let i = 2; i < tokens.length; i++) {
                if(!Number.isNaN(Number(tokens[i]))) {
                    week = Number(tokens[i])
                } else if (searchTerm == null) {
                    searchTerm = tokens[i];
                }
            }
            console.log(`${week} ${typeof week}`)
            console.log(`${searchTerm} ${typeof searchTerm}`)
            api.get_scoreboard(2019, week)
                .then(sb => {
                    let data = sb.get_score_data(searchTerm)
                    let winningUrl = data[0].score == data[1].score ? "" : data[0].score > data[1].score ? data[0].logo : data[1].logo
                    const output = {
                        color: 0x0099ff,
                        title: `Week ${sb.schedule[0].matchupPeriodId} - ${data[0].teamName} vs. ${data[1].teamName}`,
                        thumbnail: {
                            url: winningUrl,
                        },
                        fields: [
                            {
                                name: data[0].teamName,
                                value: `${data[0].score}`,
                                inline: true,
                            },
                            {
                                name: data[1].teamName,
                                value: `${data[1].score}`,
                                inline: true,
                            }
                        ]
                    };
                    msg.channel.send({embed: output})
                })
        }
        msg.delete();
    }
});

bot.login(config.bot_token);