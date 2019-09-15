# fantasy-football-discordbot
Discordbot for ESPN fantasy football

## How to use

1. [Install Node.js](https://nodejs.org/en/download/)
2. [Clone this repo](https://help.github.com/en/articles/cloning-a-repository)
3. Add information about your league and bot to the [config.json](./config/config.json) as follows:
    1. Set the `league_id` value based on your league. This can usually be found in the url as the parameter `league_id=00000` on any place on your league site.
    1. Set the `league_private` parameter to `true` if you have a private league. If this is the case, will also need to set the `espn_s2` value in order to get access to ESPN API data for your league. This value is a cookie stored in the network traffic which can be accessed as follows:
    ```
    1. Login to your league with some credentials.
    2. On any page in the league site (while logged in), go to Developer Tools for your internet browser (F12 usually works). 
    3. Switch to the Network tab and highlight the XHR options. Then refresh the page to gather network traffic.
    4. In the traffic that appears, look for any API call with a URL name starting with 'https://fantasy.espn.com/apis/v3'
    5. For one of thoses calls, click the name, go to the Cookies tab, and scroll through the cookies until you find 'espn_s2'.
    6. Copy the long value of that cookie into your config file 
    ```
    1. More on setting up a bot later...
4. To run, use `node ./integrations/discord_bot.js` to start the bot
5. To test, use `node ./main.js` (to be changed later)

## Development practices

If contributing to this project, please adhere to the following best practices.

### Branching

1. There are two main branches - `master` and `dev`. When starting any new work, please branch off of the `dev` branch.
2. When you are ready to merge commits, create a PR merging into the `dev` branch.
3. Changes from the `dev` branch will be moved to `master` by repo admins if the build is considered stable`

### Code Documentation

Use [JSDoc stdocumentationyle](https://devdocs.io/jsdoc/) for all major [methods and classes](https://devhints.io/jsdoc). 

### Unit testing

Practices to be added


