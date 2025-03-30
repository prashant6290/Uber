const captainModel = require('../models/captain.model');
const bcrypt = require('bcryptjs');

module.exports.createCaptain = async ({ 
    firstname, lastname, email, password, 
    color, plate, capacity, vehicleType 
}) => {
    try {
        console.log('Received Input in createCaptain:', { 
            firstname, lastname, email, password, color, plate, capacity, vehicleType 
        }); // Debugging

        if (![firstname, lastname, email, password, color, plate, capacity, vehicleType].every(Boolean)) {
            throw new Error('All fields are required');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const captain = await captainModel.create({
            fullname: { firstname, lastname },
            email,
            password: hashedPassword,
            vehicle: { color, plate, capacity, vehicleType }
        });

        return captain;
    } catch (error) {
        console.error('Error in createCaptain:', error.message);
        throw new Error(error.message);
    }
};
