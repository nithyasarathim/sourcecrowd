const CampaignData = require('../models/Campaign');

const fetchAllCampaigns = async (req, res) => {
    try {
        const campaigns = await CampaignData.find();
        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const fetchOneCampaign = async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await CampaignData.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }   
        res.status(200).json(campaign);
    }
    catch (error) {
        console.error('Error fetching campaign:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { amount, contributorName } = req.body;
    
    try {
        const campaign = await CampaignData.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        const newContribution = {
            contributorName,
            amount
        };

        const updatedCampaign = await CampaignData.findByIdAndUpdate(
            id,
            {
                $push: { contributions: newContribution },
                $inc: { amountCollected: amount }
            },
            { new: true }
        );

        res.status(200).json(updatedCampaign);
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

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
        creator
      } = req.body;
  
      // Validate required fields
      const requiredFields = ['name', 'pitch', 'description', 'moneyUsage', 'amountNeeded', 'endDate', 'creator'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          missingFields
        });
      }
  
      // Validate dates
      const startDate = new Date();
      const finalEndDate = new Date(endDate);
      if (finalEndDate <= startDate) {
        return res.status(400).json({ 
          message: 'End date must be in the future' 
        });
      }
  
      // Validate amount
      if (Number(amountNeeded) < 100) {
        return res.status(400).json({ 
          message: 'Amount needed must be at least 100' 
        });
      }
  
      // Validate categories
      const validCategories = ['environment', 'education', 'health', 'technology', 'art', 'community'];
      if (categories && categories.some(cat => !validCategories.includes(cat))) {
        return res.status(400).json({ 
          message: 'Invalid category provided' 
        });
      }
  
      // Create new campaign
      const newCampaign = new CampaignData({
        name,
        pitch,
        description,
        moneyUsage,
        amountNeeded: Number(amountNeeded),
        amountCollected: 0,
        contributions: [],
        website: website || '',
        status: 'active', // Default to active
        startDate,
        endDate: finalEndDate,
        categories: Array.isArray(categories) ? categories : [],
        creator
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


module.exports = {
    fetchAllCampaigns,
    fetchOneCampaign,
    updateCampaign,
    createCampaign
};