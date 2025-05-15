const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    match: [/^\d{16}$/, 'Please provide a valid 16-digit card number']
  },
  cardHolder: {
    type: String,
    required: true,
    trim: true
  },
  expiryMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  expiryYear: {
    type: Number,
    required: true,
    min: new Date().getFullYear(),
    max: new Date().getFullYear() + 10
  },
  cvv: {
    type: String,
    required: true,
    match: [/^\d{3,4}$/, 'Please provide a valid CVV']
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  totalContributions: {
    type: Number,
    default: 0
  },
  creditCards: [creditCardSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);