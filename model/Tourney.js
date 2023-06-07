const mongoose = require('mongoose');
const { Schema } = mongoose;

const tourneySchema = new Schema({
    tourneyOwner: { type: String },
    tourneyName: { type: String },
    nRounds: { type: Number },
    nPlayers: { type: Number },
    rankedPlayerList: [{
      name: { type: String },
      nickname: { type: String },
      side: { type: String },
      totalGainedVP: { type: Number },
      totalLostVP: { type: Number },
      leadersKilled: { type: Number },
      totalVP: { type: Number }
    }],
    roundList: [{
      roundNumber: { type: Number },
      roundScenario: { type: String },
      gameList: [{
        goodPlayer: {
          name: { type: String },
          nickname: { type: String },
          side: { type: String },
          totalGainedVP: { type: Number },
          totalLostVP: { type: Number },
          leadersKilled: { type: Number },
          totalVP: { type: Number }
        },
        evilPlayer: {
          name: { type: String },
          nickname: { type: String },
          side: { type: String },
          totalGainedVP: { type: Number },
          totalLostVP: { type: Number },
          leadersKilled: { type: Number },
          totalVP: { type: Number }
        },
        gamePoints: [{
          goodGainedVP: { type: Number },
          goodLostVP: { type: Number },
          evilGainedVP: { type: Number },
          evilLostVP: { type: Number },
          goodHasKilledLeader: { type: Boolean },
          evilHasKilledLeader: { type: Boolean }
        }]
      }]
    }],
    scenarioList: [{ type: String }]
  });

mongoose.model('tourneys', tourneySchema);