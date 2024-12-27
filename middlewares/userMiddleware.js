const jwt = require('jsonwebtoken');

const userMiddleware = async (req, res, next) => {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];  // Check for 'Bearer <token>'

    // If no token is provided, return a 401 Unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'Authorization failed. Token is missing.' });
    }

    try {
        // Verify the JWT token and decode the user information
        const decoded = jwt.verify(token, process.env.JWTPASSWORD);  // Make sure process.env.JWTPASSWORD is set correctly

        // Attach user info to the request object for later use
        req.user = decoded;

        // If the role is not found or the role is not 'user', return a 403 Forbidden error
        if (!req.user.role || req.user.role !== 'user') {
            return res.status(403).json({ message: 'Access denied. You are not authorized as a user.' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('JWT Error: ', err);  // Log the error for debugging
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = userMiddleware;
