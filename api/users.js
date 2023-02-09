/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const { getUserByUsername, createUser, getAllRoutinesByUser, getPublicRoutinesByUser } = require('../db')
const { UserTakenError, PasswordTooShortError } = require('../errors')
const bcrypt = require("bcrypt");


// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const _user = await getUserByUsername(username)
        if (_user) {
            res.send({
                message: UserTakenError(username),
                error: 'Username taken loser',
                name: 'UsernameTakenError'
            })
        }
        if (password.length < 8) {
            res.send({
                message: PasswordTooShortError(username),
                error: 'Password too short',
                name: 'ShortPassError'

            })
        }
        const user = await createUser({ username, password });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: "thank you for signing up",
            token,
            user
        });
    } catch (error) {
        next(error)
    }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            res.send({
                name: 'PasswordMismatch',
                message: 'Username or Password does not match'
            })
        }
        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: "you're logged in!",
            token,
            user
        });
    } catch (error) {
        next(error);
    }
})

// GET /api/users/me
router.get('/me', async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) {
            res.status(401).send({
                error: 'NoToken',
                message: "You must be logged in to perform this action",
                name: 'NoTokenFound'
            })
        }
        const newToken = token.slice(7)
        const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
        const user = await getUserByUsername(verifiedToken.username)
        if(user){
            res.send(user);
        }
    } catch (error) {
        next(error);
    }
})

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
    const token = req.header('Authorization');
    try {
        const { username } = req.params;
        if (!token) {
            res.status(401).send({
                error: 'NoToken',
                message: "You must be logged in to perform this action",
                name: 'NoTokenFound'
            })
        }
        const newToken = token.slice(7)
        const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
        const user = await getUserByUsername(verifiedToken.username);
        if(user.username === username){
            const routines = await getAllRoutinesByUser({username:user.username})
            res.send(routines)
        }
        const publicRoutines = await getPublicRoutinesByUser({username:username})
        res.send(publicRoutines)
    } catch (error) {
        next(error);
    }
})

module.exports = router;
