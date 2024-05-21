const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Password validation function
const passwordValidator = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: passwordValidator,
            message: props => `${props.value} is not a valid password. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.`
        }
    },
    userSince: {
        type: Date,
        default: Date.now
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    nameTag: {
        type: String,
        unique: true
    }
});

// Pre-save hook to hash password and generate unique nameTag
userSchema.pre('save', async function (next) {
    const user = this;

    // Hash the password if it has been modified or is new
    if (user.isModified('password')) {
        try {
            const hash = await bcrypt.hash(user.password, 10);
            user.password = hash;
        } catch (err) {
            return next(err);
        }
    }

    // Generate a unique nameTag if it is not set
    if (!user.nameTag) {
        let unique = false;
        while (!unique) {
            const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
            const nameTag = `${user.username}#${randomNum}`;
            const existingUser = await mongoose.models.User.findOne({ nameTag });
            if (!existingUser) {
                user.nameTag = nameTag;
                unique = true;
            }
        }
    }

    next();
});

userSchema.methods.checkPassword = async function (passwordAttempt) {
    try {
        return await bcrypt.compare(passwordAttempt, this.password);
    } catch (err) {
        throw err;
    }
};

userSchema.methods.withoutPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);

