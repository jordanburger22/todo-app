const express = require('express')
const todoRouter = express.Router()
const {getAllTodos, getUserTodos, addNewTodo, deleteToDo, updateTodo} = require('../controller/todoController')

// get all
todoRouter.get('/', getAllTodos)

// get users
todoRouter.get('/user', getUserTodos)

// add todo
todoRouter.post('/', addNewTodo)

// delete todo
todoRouter.delete('/:todoId', deleteToDo)

// update todo
todoRouter.put('/:todoId', updateTodo)

module.exports = todoRouter