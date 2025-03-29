const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
            trim: true
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    socketId: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Generate authentication token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Compare hashed passwords
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Hash password before saving
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
