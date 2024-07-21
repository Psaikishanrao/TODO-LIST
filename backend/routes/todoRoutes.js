const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve a list of all todos
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', protect, todoController.getTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     description: Retrieve a single todo by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Todo not found
 */
router.get('/:id', protect, todoController.getTodo);

/**
 * @swagger
 * /api/todos/createtodo:
 *   post:
 *     summary: Create a new todo
 *     description: Add a new todo to the list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created
 *       400:
 *         description: Bad request
 */
router.post('/createtodo', protect, todoController.createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Update an existing todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Todo not found
 */
router.put('/:id', protect, todoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}/status:
 *   put:
 *     summary: Update a todo's status
 *     description: Update the status of an existing todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo status updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Todo not found
 */
router.put('/:id/status', protect, todoController.updateTodoStatus);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Remove a todo from the list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 */
router.delete('/:id', protect, todoController.deleteTodo);

module.exports = router;
