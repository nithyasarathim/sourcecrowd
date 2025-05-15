const express = require('express');
const router = express.Router();
const {
    fetchAllCampaigns,
    fetchOneCampaign,
    updateCampaign,
    createCampaign
} = require('../Controller/CampaignController');
const { updateMany } = require('../models/Campaign');

router.get('/all', fetchAllCampaigns);
router.get('/:id', fetchOneCampaign);
router.post('/update/:id',updateCampaign);
router.post('/create', createCampaign);


module.exports = router;