const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <--- 1. IMPORT
const User = require('../models/User');

// ... (kod rejestracji bez zmian) ...

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

        // --- ZMIANA: TWORZENIE TOKENA ---
        const token = jwt.sign(
            { id: user._id, name: user.name }, // Co szyfrujemy? (ID i imię)
            process.env.JWT_SECRET,            // Klucz z .env
            { expiresIn: '1h' }                // Ważność: 1 godzina
        );

        // Wysyłamy token jako ciasteczko (httpOnly - bezpieczniejsze dla JS)
        res.cookie('token', token, { 
            httpOnly: true, 
        });

        res.status(200).json({ message: "Zalogowano pomyślnie!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Błąd serwera." });
    }
});

// Dodatkowy endpoint do wylogowania (usuwa ciasteczko)
router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Wylogowano" });
});

// Dodatkowy endpoint: "Kim jestem?" (dla frontendu)
router.get("/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: verified });
    } catch (err) {
        res.status(401).json({ user: null });
    }
});

module.exports = router;