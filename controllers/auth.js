const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
        // user exists => Check password
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // generate Token, passwords matched
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, { expiresIn: 3600 })

            res.status(200).json({
                token: `Bearer ${token}`
            })
        }
        else {
            // passwords did not match
            res.status(401).json({
                message: 'Password is incorrect. Try again.'
            })
        }
    }
    else {
        // user is not found => Error
        res.status(404).json({
            message: 'User with this email is not found'
        })
    }
}

module.exports.register = async function (req, res) {
    // email password
    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
        // user exists => Error
        res.status(409).json({
            message: "User with this email already exists."
        })

    } else {
        // need to create a new user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            // Handle the error
            errorHandler(res, e)
        }
    }
}