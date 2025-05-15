const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  contributorName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const campaignSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  pitch: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  moneyUsage: {
    type: String,
    required: true,
    maxlength: 1000
  },
  amountNeeded: {
    type: Number,
    required: true,
    min: 100
  },
  amountCollected: {
    type: Number,
    default: 0,
    min: 0
  },
  contributions: [contributionSchema],
  website: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'finished'],
    default: 'draft'
  },
  email: {
    type : String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  categories: {
    type: [String],
    enum: ['environment', 'education', 'health', 'technology', 'art', 'community'],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);