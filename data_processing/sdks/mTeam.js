const DraftDetail = require('./draft.js').DraftDetail;
const LeagueStatus = require('./league.js').LeagueStatus;

class mTeam {
    /**
     * @constructor 
     * @property {DraftDetail} draftDetail
     * @property {number} gameId Integer 
     * @property {number} id Integer representing id of the league
     * @property {Owner[]} members Array of owners
     * @property {number} scoringPeriodId Integer from 0-18 representing week of the season
     * @property {number} seasonId Integer representing year of the season
     * @property {number} segmentId Integer (multi-week scoring tracker?)
     * @property {LeagueStatus} status Object representing status information about the league
     * @property {Team[]} teams Array of team data from API request
     */
    constructor() {
        this.draftDetail = new DraftDetail();
        this.gameId = 0 
        this.id = 0; 
        this.members = []; 
        this.scoringPeriodId = 0; 
        this.seasonId = 2019; 
        this.segmentId = 0; 
        this.status = new LeagueStatus();
        this.teams = [];                
    }
}

/**
 * Class representing information about an ESPN user that is an owner of a team in the fantasy league
 */
class Owner {
    /**
     * @constructor
     * @property {string} displayName Name displayed by ESPN
     * @property {string} firstName First name of ESPN user
     * @property {string} id Stringified UUID  in parenthesis (ike '{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx}')
     * @property {string} lastName Last name of ESPN user
     * @property {NotificationSettings[]} notificationSettings Array representing notification settings for ESPN user
     */
    constructor() {
        this.displayName = "";
        this.firstName = "";
        this.id = "{}";
        this.lastName =  "";
        this.notificationSettings = [];
    }
}

class NotificationSettings {
    /**
     * @constructor
     * @property {boolean} enabled Boolean indicating if notification setting is enabled
     * @property {id} enabled String UUID
     * @property {boolean} type String repreesnting a notification type (see constant for possible values)
     */
    constructor() {
        this.enabled = false,
        this.id = "";
        this.type = "";
    }
} 

class LeagueStatus {
    /**
     * @constructor
     * @property {number} activatedDate Number representing millisecond timestamp of date league was activated
     * @property {number} createdAsLeagueType Integer representing initial type of league based on ESPN's internal classification
     * @property {number} currentLeagueType Integer representing current type of league based on ESPN's internal classification 
     * @property {number} currentMatchupPeriod Integer from 0-18 representing current week of league 
     * @property {number} finalScoringPeriod Integer from 1-17 representing final week of league 
     * @property {number} firstScoringPeriod Integer from 1-17 representing first week of league 
     * @property {boolean} isActive Boolean indicating if league is active
     * @property {boolean} isExpired Boolean indicating if league has expired
     * @property {boolean} isFull Boolean indicating if league is full (all teams have owners)
     * @property {boolean} isToBeDeleted Boolean indicating if league should be deleted
     * @property {boolean} isViewable Boolean indicating if league can be viewed
     * @property {boolean} isWaiverOrderEdited Boolean indicating if waiver order has been manually adjusted
     * @property {boolean} latestScoringPeriod Integer from 0-18 representing last completed week of league 
     * @property {number[]} previousSeasons Array of integers representing years in which league has been active
     * @property {number} standingsUpdateDate Number representing millisecond timestamp of when the standings were last updated
     * @property {number} teamsJoined Number of teams in the league
     * @property {number} transactionScoringPeriod ?
     * @property {number} standingsUpdateDate Number representing millisecond timestamp of when the waivers were last processed
     * @property {Object} waiverProcessStatus ?
     */
    constructor() {
        this.activatedDate = Date.now();
        this.createdAsLeagueType = 0;
        this.currentLeagueType = 0;
        this.currentMatchupPeriod = 0;
        this.finalScoringPeriod = 17;
        this.firstScoringPeriod = 1;
        this.isActive = true;
        this.isExpired = false;
        this.isFull = false;
        this.isPlayoffMatchupEdited = false;
        this.isToBeDeleted = false;
        this.isViewable = false;
        this.isWaiverOrderEdited = false;
        this.latestScoringPeriod = 0;
        this.previousSeasons = [];
        this.standingsUpdateDate = Date.now();
        this.teamsJoined = 8;
        this.transactionScoringPeriod = 0;
        this.waiverLastExecutionDate = Date.now();
        //TODO - figure out 
        this.waiverProcessStatus = {
            "2019-09-03T07:05:50.439+0000": 2,
            "2019-09-11T08:13:36.858+0000": 10,
            "2019-09-12T07:35:20.395+0000": 1,
            "2019-09-18T08:18:04.148+0000": 9,
            "2019-09-19T07:25:18.844+0000": 1,
            "2019-09-25T08:11:54.743+0000": 8,
            "2019-09-26T08:03:07.121+0000": 3
        }
    }
}

class Team {
    constructor() {
        this.abbrev = "";
        this.currentProjectedRank: number
        this.divisionId: number
        this.draftDayProjectedRank: number
        this.draftStrategy = new TeamDraftStrategy();           
        this.id: number
        this.isActive: boolean
        this.location: string
        this.logo: string
        this.logoType: string
        this.nickname: string
        this.owners: array
                    ArrayObj: string
                playoffSeed: number
                points: number
                pointsAdjusted: number
                pointsDelta: number
                primaryOwner: string
                rankCalculatedFinal: number
                rankFinal: number
                record: object
                    away: object
                        gamesBack: number
                        losses: number
                        percentage: number
                        pointsAgainst: number
                        pointsFor: number
                        streakLength: number
                        streakType: string
                        ties: number
                        wins: number
                    division: object
                        gamesBack: number
                        losses: number
                        percentage: number
                        pointsAgainst: number
                        pointsFor: number
                        streakLength: number
                        streakType: string
                        ties: number
                        wins: number
                    home: object
                        gamesBack: number
                        losses: number
                        percentage: number
                        pointsAgainst: number
                        pointsFor: number
                        streakLength: number
                        streakType: string
                        ties: number
                        wins: number
                    overall: object
                        gamesBack: number
                        losses: number
                        percentage: number
                        pointsAgainst: number
                        pointsFor: number
                        streakLength: number
                        streakType: string
                        ties: number
                        wins: number
                tradeBlock: object
                transactionCounter: object
                    acquisitionBudgetSpent: number
                    acquisitions: number
                    drops: number
                    matchupAcquisitionTotals: object
                        2: number
                    misc: number
                    moveToActive: number
                    moveToIR: number
                    paid: number
                    teamCharges: number
                    trades: number
                valuesByStat: object
                    4: number
                    5: number
                    19: number
                    20: number
                    24: number
                    25: number
                    26: number
                    42: number
                    43: number
                    44: number
                    63: number
                    72: number
                    74: number
                    77: number
                    80: number
                    85: number
                    86: number
                    88: number
                    89: number
                    90: number
                    91: number
                    92: number
                    93: number
                    95: number
                    96: number
                    97: number
                    98: number
                    99: number
                    101: number
                    102: number
                    103: number
                    104: number
                    122: number
                    123: number
                    124: number
                    125: number
                waiverRank: number
    }
}

class TeamDraftStrategy {
    /**
     * @constructor
     * @property {PlayerDraftStrategy[]} draftList Array of objects representing auction values for players
     * @property {number[]} futureKeeperPlayerIds Array of player ids representing keepers for next season
     * @property {number[]} keeperPlayerIds Array of player ids representing current keepers
     */
    constructor() {
        this.draftList = [];
        this.futureKeeperPlayerIds = [];
        this.keeperPlayerIds = [];
    }
}

class PlayerDraftStrategy {
    /**
     * @constructor
     * @property {number} auctionValue Desired auction value planned for player
     * @property {number} keeperPlayerIds Number representing player id
     */
    constructor() {
        this.auctionValue = 0;
        this.playerId = 0;
    }
}

