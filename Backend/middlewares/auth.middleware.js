const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ]; 
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }


    const isblackListed = await userModel.findOne({ token });

    if (isblackListed) {
        return res.status(401).json({ message: "Token is blacklisted" });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};


module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ]; 

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

   

    const isblackListed = await blackListTokenModel.findOne({ token: token });


    if (isblackListed) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;

        return next()

    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}