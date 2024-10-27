"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
function authMiddleware(req, res, next) {
    const { action } = req.query;
    // Check if user authorized adn skip this if we deal with login or register methods
    if (req.session.user || action === "login" || action === "register") {
        next();
    }
    else {
        console.error("Unauthorized access attempt. User is not authenticated.");
        res.status(401).json({ error: "Unauthorized" });
    }
}
