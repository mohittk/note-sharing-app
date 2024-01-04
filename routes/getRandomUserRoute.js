const express = require('express');
const authController = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const randomUser = await User.aggregate([ { $sample: {size: 1}}]);
        if(randomUser && randomUser.length > 0) {
            const token = jwt.sign({ userId: randomUser[0]._id},config.secretKey, {expiresIn: config.expiresIn})
            return res.status(200).json({token})
        }
        else{
            //console.log("No users found");
        }
    } catch (err) {
        res.status(500).json({message: 'Internal Server Error' + err.message});
    }
})

module.exports = router;
