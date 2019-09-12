const Discord = require('discord.js');
const config = require('../config/config.json');
const api = require('../data_processing/apis.js');
// Configure logger settings


const bot = new Discord.Client();
bot.on('ready', function (evt) {
    console.log('Ready')
});
bot.on('message', msg => {
    //console.log(msg);
    if(!msg.author.bot && msg.isMentioned(config.bot_id)) {
        if(msg.content.includes("scoreboard")) {
            api.get_scoreboard(2019)
                .then(sb => {
                    let data = sb.get_score_data('lAne')[0];
                    const output = {
                        color: 0x0099ff,
                        title: 'Some title',
                        author: {
                            name: 'Some name',
                            icon_url: data.logo
                        },
                        description: 'Some description here',
                        thumbnail: {
                            url: data.logo,
                        },
                        fields: [
                            {
                                name: 'Regular field title',
                                value: 'Some value here',
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                            },
                            {
                                name: 'Inline field title',
                                value: 'Some value here',
                                inline: true,
                            },
                            {
                                name: 'Inline field title',
                                value: 'Some value here',
                                inline: true,
                            },
                            {
                                name: 'Inline field title',
                                value: 'Some value here',
                                inline: true,
                            },
                        ],
                        image: {
                            url: data.logo,
                        },
                        footer: {
                            text: 'Some footer text here',
                            icon_url: data.logo,
                        },
                    };
                    msg.channel.send({embed: output})
                })
        }
        msg.delete();
    }
});

bot.login(config.bot_token);