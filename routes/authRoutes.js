const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, getProfile } = require('../controllers/authController')

// middleware
router.use(
    cors({
        credentials: true,
        origin: 'https://cssa-member-frontend.vercel.app/',
        methods: ['POST', 'GET']
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)

module.exports = router