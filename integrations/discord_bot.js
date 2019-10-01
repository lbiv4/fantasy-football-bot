const Discord = require('discord.js');
const config = require('../config/config.json');
const api = require('../data_processing/apis.js');
// Configure logger settings


const bot = new Discord.Client();
bot.on('ready', function (evt) {
    console.log('Ready')
});
bot.on('message', msg => {
    console.log(msg.author)
    if(!msg.author.bot && msg.isMentioned(config.bot_id)) {
        let currentYear = new Date().getFullYear();
        const tokens = msg.cleanContent.replace(/\s+/g, " ").split(" ");
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
        } else if (tokens[1].toLowerCase() == "injury_warning") {
            if(tokens[2].toLowerCase() == "start") {
                let hours = 1;
                if(tokens.length >= 4 && !Number.isNaN(Number(tokens[3]))) {
                    hours = Number(tokens[3]); //Get hours from third token or default
                }
                let id = bot.setInterval (async () => {
                    let currentWeek = await api.get_scoring_period(currentYear)
                    let inactiveData = await api.get_inactive_starters(currentYear, currentWeek);
                    inactiveData.forEach(team => {
                        const teamInfo = team.team.get_display_info();
                        let playerNames = "";
                        let playerStatuses = ""
                        team.inactivePlayers.forEach(plr => {
                            playerNames += `${plr.fullName}\n`
                            if(plr.is_injured()) {
                                playerStatuses += `${plr.injuryStatus}\n`
                            } else {
                                playerStatuses += `BYE WEEK\n`
                            }
                        })
                        const output = {
                            color: 0xff8700,
                            title: `INJURED STARTERS WARNING - ${teamInfo.teamName}`,
                            thumbnail: {
                                url: teamInfo.logo,
                            },
                            fields: [
                                {
                                    name: "Player Names",
                                    value: playerNames,
                                    inline: true,
                                },
                                {
                                    name: "Status",
                                    value: playerStatuses,
                                    inline: true,
                                }
                            ]
                        };
                        msg.channel.send({embed: output}).then(sent => {
                            sent.delete(60 * 60 * 1000 * hours);
                        })
                    })
                }, 60 * 60 * 1000 * hours);
                console.log(id)
            } else if(tokens[2].toLowerCase() == "stop") {

            }
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
            api.get_fantasy_scoreboard(currentYear, week)
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