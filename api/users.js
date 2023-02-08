/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

// POST /api/users/register
router.post('/register')

// POST /api/users/login
router.post('/login')

// GET /api/users/me
router.get('/me')

// GET /api/users/:username/routines
router.get('/:username.routines')

module.exports = router;
