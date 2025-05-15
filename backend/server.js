// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const campaignRoutes = require('./router/campaignRoutes');


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

app.use('/campaign', campaignRoutes);

mongoose.connect("mongodb://localhost:27017/sourcecrowd")
  .then(() => {
    console.log('MongoDB connected');
    app.listen(9000, () => {
      console.log(`Server running at http://localhost:9000`);
    });
  })
  .catch(err => console.log('DB connection error:', err));

