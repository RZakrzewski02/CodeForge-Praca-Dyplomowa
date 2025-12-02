require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


//Rejestracja i logowanie
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'get_started.html'));
});

app.use('/api', authRoutes);

app.get("/main", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main.html'));
});



app.listen(PORT, () => console.log("Server running on port 3000"));