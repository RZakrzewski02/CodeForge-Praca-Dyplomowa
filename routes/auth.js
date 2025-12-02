const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 1. Rejestracja
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Użytkownik o takim emailu już istnieje." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "Rejestracja pomyślna! Możesz się zalogować." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Błąd serwera podczas rejestracji." });
    }
});

// 2. Logowanie
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Nieprawidłowy email lub hasło." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Nieprawidłowy email lub hasło." });
        }

        res.status(200).json({ message: "Zalogowano pomyślnie!", userName: user.name });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Błąd serwera podczas logowania." });
    }
});

module.exports = router;