const mocha = require('mocha');
const chai = require('chai');
const players = require("../data_processing/players");
const PLAYER_SLOT_IDS = players.PLAYER_SLOT_IDS;
const expect = chai.expect; 



describe('player.js unit tests', function() {

    before(function() {
    });

    describe('Player tests', function() {
        const Player = players.Player;
        const mockPlayerData = {
            lineupSlotId: 20, //BE
            playerPoolEntry: {
                appliedStatTotal: 0,
                onTeamId: 0,
                player: {
                    active: true,
                    defaultPositionId: 20,
                    eligibleSlots: [0, 2, 3, 4, 6, 16, 17, 20, 21, 23], 
                    firstName: "Test",
                    fullName: "Test Player",
                    id: 0,
                    injured: false,
                    injuryStatus: "ACTIVE",
                    jersey: 0,
                    lastName: "Player",
                    proTeamId: 0
                }
            }
        }
        describe('is_starter() tests', () => {
            it('should return true unless player slot is BE or IR', function(done) {
                const  testPlayer = new Player(mockPlayerData);
                testPlayer.eligibleSlots.forEach(slotId => {
                    testPlayer.lineupSlotId = slotId;
                    testPlayer.lineupSlot = PLAYER_SLOT_IDS[slotId];
                    if(testPlayer.lineupSlot === "BE" || testPlayer.lineupSlot ==="IR") {
                        expect(testPlayer.is_starter()).is.false;
                    } else {
                        expect(testPlayer.is_starter()).is.true;
                    }
                })
                done();
            })
        });

        describe('is_injured() tests', () => {
            it('should return true unless player slot is ACTIVE or PROBABLE', function(done) {
                const  testPlayer = new Player(mockPlayerData);
                players.INJURY_STATUS_TYPES.forEach(injuryType => {
                    testPlayer.injuryStatus = injuryType;
                    if(testPlayer.injuryStatus === "PROBABLE" || testPlayer.injuryStatus === "ACTIVE") {
                        expect(testPlayer.is_injured()).is.false;
                    } else {
                        expect(testPlayer.is_injured()).is.true;
                    }
                })
                done();
            })
        });
    });
    
});