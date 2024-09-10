const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')

const test = (req, res) => {
    res.json('test is working !!!')
}

// register endpoint

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // checks and balances

        // name was entered?
        if(!name) {
            return res.json({
                error: 'please input a name!!'
            })
        }

        // email was entered?
        if(!email) {
            return res.json({
                error: 'please input a email!!'
            })
        }

        // password was entered? >= 6 characters?
        if (!password || password.length < 6) {
            return res.json({
                error: 'please input a password of six or more characters!!'
            })
        }

        // email is unique?
        const exist = await User.findOne({email})

        if (exist) {
            return res.json({
                error: 'account with this email already exisits!!'
            })
        }

        // hashing
        const hashedPassword = await hashPassword(password)

        // create user in database
        const user = await User.create({
            name, email, password: hashedPassword
        })

        return res.json(user)

    } catch (error) {
        console.log(error)
    }

}

// login endpoint

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // checks and balances

        // user exists?
        const user = await User.findOne({email})

        if (!user) {
            return res.json({
                error: 'account is not found!!'
            })
        }

        // password match?
        const match = await comparePassword(password, user.password)

        if (match) {
            jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
        }

        if (!match) {
            res.json({
                error: 'password is incorrect!!'
            })
        }

    } catch (error) {
        console.log(error)
    }

}

// profile endpoint
const getProfile =  (req, res) => {
    const {token} = req.cookies

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }

}

module.exports = {

    test,
    registerUser,
    loginUser,
    getProfile
}