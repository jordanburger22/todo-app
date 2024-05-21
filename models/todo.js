const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const todoSchema = new Schema({
    todo: {
        type: String,
        required: true
    },
    finishByDate: {
        type: Date
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    authors_username: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
})

// Add a method to upload image to Cloudinary
todoSchema.methods.uploadImage = async function (filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'todos' // Optional: specify a folder for your todo images
        });
        this.image = result.secure_url;
        await this.save(); // Save the updated document
        return this.image;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error; // Re-throw the error for handling
    }
};


module.exports = mongoose.model('Todo', todoSchema)