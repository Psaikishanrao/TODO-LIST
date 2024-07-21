const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const todoRoutes = require('../routes/todoRoutes');
const authRoutes = require('../routes/authRoutes');
const Todo = require('../models/Todo');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to mongdb');
  })
  .catch((err) => {
    console.error('error while connecting to mongdb:', err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

describe('Todo Routes', () => {
  let userToken, user;

  beforeEach(async () => {
    user = new User({ username: 'saikishan', password: 'saikishan785' });
    await user.save();
    userToken = generateToken(user._id);
  });

  it('should create a new todo for the authenticated user', async () => {
    const res = await request(app)
      .post('/api/todos/createtodo')
      .set('Cookie', `token=${userToken}`)
      .send({
        title: 'Workout',
        description: 'Running 4 km, 2hrs gym',
        category: 'Personal',
        status: 'pending',
        dueDate: new Date().toISOString(),
      });

    console.log('Create Todo Response:', res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Workout');
  });

  it('should get all todos for the authenticated user only', async () => {
    await Todo.create({ title: 'Admin Ticket', description: 'todo Admin authentication, unresolved Bugs', category: 'Work', status: 'pending', dueDate: new Date(), user: user._id });

    const res = await request(app)
      .get('/api/todos')
      .set('Cookie', `token=${userToken}`);

    console.log('Get Todos Response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('title', 'Admin Ticket');
  });

  it('should update a todo for the authenticated user', async () => {
    const todo = await Todo.create({ title: 'User Todo', description: 'User Todo Description', category: 'Work', status: 'pending', dueDate: new Date(), user: user._id });

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .set('Cookie', `token=${userToken}`)
      .send({ title: 'Updated Todo' });

    console.log('Update Todo Response:', res.body); 
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Todo');
  });

  it('should delete a todo for the authenticated user', async () => {
    const todo = await Todo.create({ title: 'User Todo', description: 'User Todo Description', category: 'Work', status: 'pending', dueDate: new Date(), user: user._id });

    const res = await request(app)
      .delete(`/api/todos/${todo._id}`)
      .set('Cookie', `token=${userToken}`);

    console.log('Delete Todo Response:', res.body); 
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Todo deleted successfully');
  });

  it('should not allow a user to access another user\'s todos', async () => {
    const otherUser = new User({ username: 'otheruser', password: 'password' });
    await otherUser.save();
    const otherUserToken = generateToken(otherUser._id);

    const todo = await Todo.create({ title: 'Other User Todo', description: 'Other User Todo Description', category: 'Work', status: 'pending', dueDate: new Date(), user: otherUser._id });

    const res = await request(app)
      .get(`/api/todos/${todo._id}`)
      .set('Cookie', `token=${userToken}`);

    console.log('Get Other User\'s Todo Response:', res.body); 
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Todo not found');
  });
});
