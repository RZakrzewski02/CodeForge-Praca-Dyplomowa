const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Pobierz token z ciasteczek
    const token = req.cookies.token;

    // 2. Jeśli brak tokena -> wyrzuć na stronę logowania
    if (!token) {
        return res.redirect('/'); 
    }

    try {
        // 3. Sprawdź czy token jest ważny (czy my go wystawiliśmy)
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Zapisz dane użytkownika w żądaniu
        next(); // Wszystko ok, przepuść dalej
    } catch (err) {
        // Token nieważny/sfałszowany -> wyrzuć na start
        res.redirect('/');
    }
};

module.exports = authMiddleware;