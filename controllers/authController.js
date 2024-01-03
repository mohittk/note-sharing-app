const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const signup = async(req, res) => {
    try {
        const {username, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email is already registered'});
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: 'User registered successfully'})
    } catch(err){
        res.status(500).json({message: 'Internal Server Error' + err.message});
    }
}


const login = async(req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const token = jwt.sign({userId: user._id}, config.secretKey, {expiresIn: config.expiresIn})
        res.status(200).json({token});
    } catch(err) {
        res.status(500).json({message: 'Internal Server Error' + err.message});
    }
}

module.exports = {
    signup,
    login
};