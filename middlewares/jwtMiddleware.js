const jwt = require('jsonwebtoken');


const jwtMiddleware = async (req, res, next) => {
   
    const token = req.header('authorization')?.split(" ")[1];

    
    if (!token) {
        return res.status(401).json("Authorization failed. Token is missing.");
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWTPASSWORD);

        
        req.user = decoded;

        
        if (req.user.role !== 'admin') {
            return res.status(401).json("Access denied. You are not an admin.");
        }

      
        next();
    } catch (err) {
        console.error("JWT Error: ", err);
        return res.status(401).json("Invalid or expired token.");
    }
};

module.exports = jwtMiddleware;
