const express = require('express');
const { getAllActivities, getPublicRoutinesByActivity, createActivity, getActivityByName, updateActivity } = require('../db');
const router = express.Router();
const { ActivityNotFoundError, ActivityExistsError } = require('../errors')
//hello

// GET /api/activities
router.get('/', async (req, res, next) => {
    try {
        const activity = await getAllActivities()
        res.send(activity);
    } catch (error) {
        next(error);
    }
})

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    const { activityId } = req.params
    try {
        const routines = await getPublicRoutinesByActivity({ id: activityId })
        if (routines.length) {
            res.send(routines);
        }
        res.send({
            error: 'No activity with given ID',
            message: ActivityNotFoundError(activityId),
            name: 'NoActivityFoundError'
        })
    } catch (error) {
        next(error);
    }
})

// POST /api/activities
router.post('/', async (req, res, next) => {
    const { name, description } = req.body;
    try {
        if (await getActivityByName(name)) {
            res.send({
                error: 'You already made that man',
                message: 'An activity with name Push Ups already exists',
                name: 'ActivityAlreadyExists'
            })
        }
        const activity = await createActivity({ name, description });
        res.send(activity);
    } catch (error) {
        next(error);
    }
})

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
    const {name} = req.body;
    const {activityId} = req.params;
    const token = req.header('Authorization');
    try{
        if (!token) {
            res.send({
                error: 'NoToken',
                message: "You must be logged in to perform this action",
                name: 'NoTokenFound'
            })
        }
        if (await getActivityByName(name)) {
            res.send({
                error: 'You already made that man',
                message: ActivityExistsError(name),
                name: 'ActivityAlreadyExists'
            })
        }
        const activity = await updateActivity({id:activityId, ...req.body});
        if(!activity){
            res.send({
                error: 'NoActivity',
                message : ActivityNotFoundError(activityId),
                name: 'NoActivityError'
            })
        }
        res.send(activity);
    }catch(error){
        next(error);
    }
})

module.exports = router;