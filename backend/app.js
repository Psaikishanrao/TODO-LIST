const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const swaggerSetup = require('./swagger');
const cors = require('cors');

app.use(cors({
  origin: 'https://todo-list-2hhy.onrender.com'
}));

dotenv.config();
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);
swaggerSetup(app);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
