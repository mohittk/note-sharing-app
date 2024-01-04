const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    //console.log("yesssss")
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }
    const tokenWithoutBearer = token.slice(7);


    try {
        const decoded = jwt.verify(tokenWithoutBearer, config.secretKey);
        //console.log('Decoded token:', decoded);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
}

module.exports = authMiddleware;