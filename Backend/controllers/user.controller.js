const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { fullname, email, password } = req.body;

    if (!fullname || !fullname.firstname || !fullname.lastname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
