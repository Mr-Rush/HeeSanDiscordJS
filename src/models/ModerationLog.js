const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
  moderatorId: {
    type: String,
    required: true,
  },
  targetUserId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ['kick', 'ban', 'unban', 'warn'],
    required: true,
  },
  reason: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ModerationLog = mongoose.model('ModerationLog', moderationLogSchema);

module.exports = ModerationLog;
