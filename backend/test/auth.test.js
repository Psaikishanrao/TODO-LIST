const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');
const Todo = require('../models/Todo');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
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
  await Todo.deleteMany({});
  await User.deleteMany({});
});

describe('Auth Routes', () => {
  it(' register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'saikishan1',
        password: 'saikishan1'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'saikishan1');
    expect(res.body).toHaveProperty('token');
  });

  it(' not registered a user with an existing username', async () => {
    const user = new User({ username: 'saikishan2', password: 'saikishan2' });
    await user.save();

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'saikishan2',
        password: 'saikishan2'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it(' authenticated an existing user', async () => {
    const user = new User({ username: 'saikishan3', password: 'saikishan3' });
    await user.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'saikishan3',
        password: 'saikishan3'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'saikishan3');
    expect(res.body).toHaveProperty('token');
  });

  it(' not authenticated a user with incorrect credentials', async () => {
    const user = new User({ username: 'saikishan4', password: 'saikishan4' });
    await user.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'saikishan4',
        password: 'saikishan98'//wrongpassword
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid username or password');
  });
});
