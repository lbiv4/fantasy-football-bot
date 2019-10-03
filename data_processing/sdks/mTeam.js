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
    /**
     * @constructor
     * @property {string} abbrev String representing 4-character team abbreviation
     * @property {number} currentProjectedRank Integer representing ESPN's current internal ranking of fantasy team in league
     * @property {number} divisionId Integer representing identifier for team's division
     * @property {number} draftDayProjectedRank Integer representing ESPN's initial internal ranking of fantasy team in league
     * @property {TeamDraftStrategy} draftStrategy Object representing team's strategy/evaluations of players for draft
     * @property {number} id Integer id of team in the league
     * @property {boolean} isActive Boolean indicating if team is active in the league
     * @property {string} location String representing first part of team name, (e.g. "Baltimore" for "Baltimore Ravens")
     * @property {string} logo String representing a url to the image used in the team profile
     * @property {string} logoType String corresponding to a value representing how image was added //TODO find out values
     * @property {string} nickname String representing second part of team name, (e.g. "Ravens" for "Baltimore Ravens")
     * @property {string[]} owners Array of string representing ids for each owner of the team (ids are styled like "{uuid}")
     * @property {number} draftDayProjectedRank Integer representing ESPN's initial internal ranking of fantasy team in league
     * @property {number} playoffSeed Integer representing playoff seed
     * @property {number} points Number representing points for on the season
     * @property {number} pointsAdjusted Number //TODO figure out purporse?
     * @property {number} pointsDelta Number //TODO figure out purporse?
     * @property {string} primaryOwner String containing uuid of primary owner, styled lik "{uuid}"
     * @property {number} rankCalculatedFinal Integer representing team's calculated final ranking at end of season or 0 if season not over
     * @property {number} rankFinal Integer representing team's final ranking at end of season or 0 if season not over
     * @property {TeamRecord} record TeamRecord object holding data on team's record
     * @property {object} tradeBlock Object //TODO figure out structure
     * @property {TransactionCounter} transactionCounter TransactionCounter object tracking team transactions
     * @property {object} valuesByStat Object mapping a number (representing some scoring value) to a number of points //TODO find mapping, turn into object
     * @property {number} waiverRank Number representing priority in league waivers
     */
    constructor() {
        this.abbrev = "";
        this.currentProjectedRank = 1;
        this.divisionId = 0;
        this.draftDayProjectedRank = 1;
        this.draftStrategy = new TeamDraftStrategy();           
        this.id = 0;
        this.isActive = true;
        this.location = "";
        this.logo = "";
        this.logoType = "";
        this.nickname = "";
        this.owners = [];

        this.playoffSeed = 1;
        this.points = 0;
        this.pointsAdjusted = 0;
        this.pointsDelta = 0;
        this.primaryOwner = "";
        this.rankCalculatedFinal = 0;
        this.rankFinal = 0;
        this.record = new TeamRecord();
        this.tradeBlock = {}; //TODO design later
        this.transactionCounter = new TransactionCounter();
        //TODO turn into proper object
        this.valuesByStat = {}
        this.waiverRank = 1;
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

class TeamRecord {
    /**
     * @constructor
     * @property {ResultsRecord} away ResultsRecord object representing team's record in away matchups
     * @property {ResultsRecord} division ResultsRecord object representing team's record in home matchups
     * @property {ResultsRecord} home ResultsRecord object representing team's record in dvision matchups
     * @property {ResultsRecord} overall ResultsRecord object representing team's record in all matchups
     */
    constructor() {
        this.away = new ResultsRecord();
        this.division = new ResultsRecord();
        this.home = new ResultsRecord();
        this.overall = new ResultsRecord();
    }
}

class ResultsRecord {
    /**
     * @constructor
     * @property {number} gamesBack Integer representing number of games back from leader
     * @property {number} losses Integer representing number of losses
     * @property {number} percentage Number representing the win percentage
     * @property {number} pointsAgainst Number representing number of points for
     * @property {number} porntsFor Number representing number of points against
     * @property {number} streakLength Integer representing number of games in the current streak
     * @property {string} streakType String representing a type of win streak a team is on
     * @property {number} ties Integer representing number of ties
     * @property {number} wins Integer representing number of wins

     */
    constructor() {
        this.gamesBack = 0;
        this.losses = 0;
        this.percentage = 0.0;
        this.pointsAgainst =  0.0;
        this.pointsFor = 0.0;
        this.streakLength = 0;
        this.streakType = "";
        this.ties = 0;
        this.wins = 0;
    }
}

class TransactionCounter {
    /**
     * @constructor
     * @property {number} acquisitionBudgetSpent Number representing amount of acquisition budget spent on free agents
     * @property {number} acquisitions Number of acquisitions made
     * @property {number} drops Number of times players were dropped
     * @property {object} matchupAcquisitionTotals Object mapping acquisition types to a count? //TODO find out more
     * @property {number} misc Number of miscellaneous actions
     * @property {number} moveToActive Number of times players were activated from IR? //TODO: check
     * @property {number} moveToIR Number of times players were moved to IR
     * @property {number} paid Number //TODO: find out
     * @property {number} teamCharges Number //TODO: find out
     * @property {number} trades Number of trades completed

     */
    constructor() {
        this.acquisitionBudgetSpent = 0;
        this.acquisitions = 0;
        this.drops = 0;
        this.matchupAcquisitionTotals = {};
        this.misc = 0;
        this.moveToActive = 0;
        this.moveToIR = 0;
        this.paid = 0;
        this.teamCharges = 0;
        this.trades = 0;
    }
}

