import jwt from 'jsonwebtoken'

// Import or get the tokenBlacklist (should be the same instance as in authRoutes)
const tokenBlacklist = new Set();

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']

    if (!token) { 
        return res.status(401).json({ message: "No token provided" }) 
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token invalidated - please login again" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { 
            return res.status(401).json({ message: "Invalid token" }) 
        }

        req.userId = decoded.id
        next()
    })
}

export default authMiddleware