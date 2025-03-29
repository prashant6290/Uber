const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');


module.exports.registerUser = async (req, res) => {
    try {  // Added missing `try {`
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log(req.body);

        const { fullname, email, password } = req.body;

        if (!fullname || !fullname.firstname || !fullname.lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password (Ensure `hashPassword` is defined in `userModel`)
        const hashedPassword = await userModel.hashPassword(password);

        // Create user
        const user = await userService.createUser({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword
        });

        // Ensure `generateAuthToken` exists in the model
        const token = user.generateAuthToken ? user.generateAuthToken() : null;

        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user by email and include password field
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Ensure `comparePassword` is properly defined and used
        if (typeof user.comparePassword !== 'function') {
            return res.status(500).json({ message: 'Internal error: comparePassword method missing' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = user.generateAuthToken ? user.generateAuthToken() : null;
           
        res.cookie('token', token);

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports.getUserProfile = async (req, res) => {
    try {
        // Ensure `req.user` is set in `authMiddleware`
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await userModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.logoutUser = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');
        const token = req.cookies.token || req.headers['x-auth-token'];
        
        await blackListTokenModel.create({ token });
        
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
};
