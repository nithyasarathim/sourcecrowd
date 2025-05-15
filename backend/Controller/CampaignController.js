const CampaignData = require('../models/Campaign');
const nodemailer = require('nodemailer');

// ✅ Mail function
const sendSuccessMail = async (toEmail, campaignName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'contact.nithyasarathi@gmail.com',
      pass: 'awns eysl niyk dcdj' // 🔐 Use environment variable in production
    }
  });

  const mailOptions = {
    from: 'contact.nithyasarathi@gmail.com',
    to: toEmail,
    subject: 'Campaign Funded!',
    text: `Good news! Your campaign "${campaignName}" has reached its funding goal.`
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Fetch all campaigns
const fetchAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignData.find();
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Fetch one campaign
const fetchOneCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await CampaignData.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Update campaign (with mail trigger)
const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const { amount, contributorName } = req.body;

  try {
    const campaign = await CampaignData.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const newContribution = { contributorName, amount };

    const updatedCampaign = await CampaignData.findByIdAndUpdate(
      id,
      {
        $push: { contributions: newContribution },
        $inc: { amountCollected: amount }
      },
      { new: true }
    );

    // ✅ Fixed field name: amountNeeded
    if (updatedCampaign.amountCollected >= campaign.amountNeeded) {
      try {
        await sendSuccessMail(campaign.email, campaign.name);
        console.log('Success email sent to', campaign.email);
      } catch (mailError) {
        console.error('Mail failed:', mailError.message);
      }
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Create campaign
const createCampaign = async (req, res) => {
  try {
    const {
      name,
      pitch,
      description,
      moneyUsage,
      amountNeeded,
      website,
      endDate,
      categories,
      email
    } = req.body;

    const requiredFields = ['name', 'pitch', 'description', 'moneyUsage', 'amountNeeded', 'endDate', 'email'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }

    const startDate = new Date();
    const finalEndDate = new Date(endDate);
    if (finalEndDate <= startDate) {
      return res.status(400).json({
        message: 'End date must be in the future'
      });
    }

    if (Number(amountNeeded) < 100) {
      return res.status(400).json({
        message: 'Amount needed must be at least 100'
      });
    }

    const validCategories = ['environment', 'education', 'health', 'technology', 'art', 'community'];
    if (categories && categories.some(cat => !validCategories.includes(cat))) {
      return res.status(400).json({
        message: 'Invalid category provided'
      });
    }

    const newCampaign = new CampaignData({
      name,
      pitch,
      description,
      moneyUsage,
      amountNeeded: Number(amountNeeded),
      amountCollected: 0,
      contributions: [],
      website: website || '',
      status: 'active',
      startDate,
      endDate: finalEndDate,
      categories: Array.isArray(categories) ? categories : [],
      email
    });

    await newCampaign.save();

    return res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign
    });

  } catch (error) {
    console.error('Error creating campaign:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Campaign name already exists'
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ✅ Exports
module.exports = {
  fetchAllCampaigns,
  fetchOneCampaign,
  updateCampaign,
  createCampaign
};
