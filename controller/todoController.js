const Todo = require('../models/todo');

const multer = require('multer'); // Import Multer

const handleErr = (err, req, res, next) => {
  res.status(500).send(err.message); // Improved error handling
  next(err);
}

const getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find();
    return res.status(200).send(todos);
  } catch (err) {
    handleErr(err, req, res, next);
  }
}


const getUserTodos = async (req, res, next) => {
  try {
    const userTodos = await Todo.find({ author: req.auth._id });
    return res.status(200).send(userTodos);
  } catch (err) {
    handleErr(err, req, res, next);
  }
}

const addNewTodo = async (req, res, next) => {
  try {
    req.body.author = req.auth._id;
    req.body.authors_username = req.auth.username;

    // Configure Multer for single file upload named "image"
    const upload = multer({ dest: 'uploads/' }); // Change 'uploads/' to your desired folder

    // Use Multer middleware before processing the request
    upload.single('image')(req, res, async (err) => {
      if (err) {
        // Handle Multer errors (e.g., file size limit exceeded)
        return next(err);
      }

      let imageUrl;

      // Check if an image file was uploaded (req.file exists)
      if (req.file) {
        const filePath = req.file.path;

        // Upload the image to Cloudinary (assuming you have the uploadImage method)
        imageUrl = await new Todo().uploadImage(filePath);

        // Update the todo data with the uploaded image URL
        req.body.image = imageUrl;
      }

      const newTodo = new Todo(req.body);
      const savedTodo = await newTodo.save();
      return res.status(201).send(savedTodo);
    });
  } catch (err) {
    handleErr(err, req, res, next);
  }
};

const deleteToDo = async (req, res, next) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.todoId, author: req.auth._id });
    return res.status(200).send(deletedTodo);
  } catch (err) {
    handleErr(err, req, res, next);
  }
}

const updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.todoId, author: req.auth._id },
      req.body,
      { new: true }
    );
    return res.status(201).send(updatedTodo);
  } catch (err) {
    handleErr(err, req, res, next);
  }
}

module.exports = {
  getAllTodos,
  getUserTodos,
  addNewTodo,
  deleteToDo,
  updateTodo
}
