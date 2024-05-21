const User = require('../models/user')
const jwt = require('jsonwebtoken')

const signinError = 'Email or Passoword Incorrect'

const signup = async (req, res, next) => {
    try {
        // Check if the email already exists
        const userCheck = await User.findOne({ email: req.body.email });
        if (userCheck) {
            res.status(403);
            return next(new Error('Account with Email already exists.'));
        }

        // Password validation function (matches the schema's password validation)
        const passwordValidator = (password) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        };

        // Validate the password
        if (!passwordValidator(req.body.password)) {
            res.status(400);
            return next(new Error('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'));
        }

        // Create a new user instance
        const newUser = new User(req.body);

        // Save the new user
        const savedUser = await newUser.save();

        // Generate a token
        const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);

        // Send response
        return res.status(201).send({ token, user: savedUser.withoutPassword() });
    } catch (err) {
        res.status(500);
        return next(err);
    }
};


const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(403)
            return next(new Error(signinError))
        }
        const passwordCheck = await user.checkPassword(req.body.password)
        if (!passwordCheck) {
            res.status(403)
            return next(new Error(signinError))
        }
        const token = jwt.sign(user.withoutPassword(), process.env.SECRET)
        return res.status(201).send({ token, user: user.withoutPassword() })
    } catch (err) {
        res.status(500)
        return next(err)
    }
}

module.exports = { signup, signin }