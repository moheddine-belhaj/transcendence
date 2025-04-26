import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// In-memory token blacklist (for production use Redis or database)
const tokenBlacklist = new Set();

// Register a new user endpoint /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        const defaultTodo = `Hello :) Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: "Username already exists" });
        }
        console.log(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        if (!user) { 
            return res.status(404).json({ message: "User not found" }) 
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) { 
            return res.status(401).json({ message: "Invalid password" }) 
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})

// Logout endpoint
router.post('/logout', (req, res) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    // Add token to blacklist
    tokenBlacklist.add(token);
    
    res.json({ message: "Successfully logged out" });
});

export default router