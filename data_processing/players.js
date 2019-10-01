
const INJURY_STATUS_TYPES = [ "ACTIVE",
                        "PROBABLE",
                        "QUESTIONABLE",
                        "DOUBTFUL",
                        "OUT",
                        "INJURY_RESERVE",
                        "DAY_TO_DAY",
                        "FIFTEEN_DAY_DL",
                        "SIXTY_DAY_DL",
                        "SEVEN_DAY_DL",
                        "TEN_DAY_DL",
                        "BEREAVEMENT",
                        "PATERNITY",
                        "SUSPENSION"]
const PLAYER_SLOT_IDS = {
    0: "QB",
    2: "RB",
    3: "RB/WR",
    4: "WR",
    6: "TE",
    16: "D/ST",
    17: "K",
    20: "BE",
    21: "IR",
    23: "FLEX"
}

const slotIdToPos = (slotId) => {
    return PLAYER_SLOT_IDS[slotId];
}

class PlayerBase {
    constructor(playerData) {
        this.active =  playerData.active;
        this.defaultPositionId = playerData.defaultPositionId;
        this.eligibleSlots = playerData.eligibleSlots;
        this.firstName = playerData.firstName;
        this.fullName = playerData.fullName;
        this.id = playerData.id;
        this.injured = playerData.injured,
        this.injuryStatus = playerData.injuryStatus;
        this.jersey = playerData.jersey;
        this.lastName = playerData.lastName;
        this.proTeamId = playerData.proTeamId;
        //this.stats
    }
}

class Player extends PlayerBase {
    constructor(playerRosterData) {
        super(playerRosterData.playerPoolEntry.player)
        this.lineupSlotId = playerRosterData.lineupSlotId;
        this.lineupSlot = slotIdToPos(this.lineupSlotId);
        this.fantasyTeamId = playerRosterData.playerPoolEntry.onTeamId;
        if(playerRosterData.playerPoolEntry.appliedStatTotal !== undefined) {
            this.scoreForWeek = playerRosterData.playerPoolEntry.appliedStatTotal.toFixed(1);
        } else {
            this.scoreForWeek = 0;
        }
    }

    is_starter() {
        return this.lineupSlot !== "BE" && this.lineupSlot != "IR";
    }

    is_injured() {
        return INJURY_STATUS_TYPES.indexOf(this.injuryStatus) >= 2
    }
}


class Roster {
    constructor(id, rosterForCurrentScoringPeriod) {
        this.teamId = id;
        this.players = [];
        rosterForCurrentScoringPeriod.entries.forEach(plr => {
            this.players.push(new Player(plr));
        })
    }

    /*get_score() {
        let totalPoints = 0.0;
        this.players.forEach(plr => {
            if(plr.is_starter()) {
                totalPoints += plr.scoreForWeek;
            }
        });
        return totalPoints;
    }*/

    get_injured_players() {
        return this.players.filter(plr => {
            return plr.is_injured();
        });
    }

    
} 

module.exports = {Player, Roster, INJURY_STATUS_TYPES, PLAYER_SLOT_IDS}