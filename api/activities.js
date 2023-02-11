const express = require('express');
const { getAllActivities } = require('../db');
const router = express.Router();


// GET /api/activities
router.get('/', async (req, res, next) => {
    try{
        const activites = await getAllActivities()
        res.send(activites);
    }catch(error){
        next(error);
    }
})

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {

})

// POST /api/activities
router.post('/', async (req, res, next) => {

})

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {

})

module.exports = router;
