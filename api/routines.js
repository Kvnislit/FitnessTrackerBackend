const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const { getAllPublicRoutines,
    getRoutineById,
    getAllRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    destroyRoutine,
    createRoutine,
    getUser,
    getUserById,
    getUserByUsername,
    getPublicRoutinesByUser,
} = require('../db');


// GET /api/routines
router.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines()
        res.send(routines);
    } catch (error) {
        next(error);
    }
})

// POST /api/routines
router.post('/', async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const token = req.header('Authorization');
   
    try {
        if (!token) {
            res.send({
                error: 'NoToken',
                message: 'You must be logged in to perform this action',
                name: 'NoTokenFound',
            });
        }
        const newToken = token.slice(7)
        const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
        const user = await getUserByUsername(verifiedToken.username)
        const newRoutine = await createRoutine({
            goal, 
            name,
            isPublic,
           creatorId: user.id
        });


        res.send(newRoutine);
    } catch (error) {
        next(error);
    }
});
// PATCH /api/routines/:routineId
router.patch('/:routineId', async (req, res, next) => {
    const { goal, isPublic, name } = req.body;
    const { routineId } = req.params
    console.log(req.params)
    const token = req.header('Authorization');
    const newToken = token.slice(7)
    const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
    const user = await getUserByUsername(verifiedToken.username)
  
    try {
        if (!user) {
            res.status(401).send({
                error: 'NoToken',
                message: 'You must be logged in to perform this action',
                name: 'NoTokenFound',
            });
           
        }

        const routine = await  getPublicRoutinesByUser ({username: name})
            console.log(routine)
        if (!routine) {
            res.status(404).send({
                error: 'RoutineNotFound',
                message: `The routine with id does not exist`,
                name: 'RoutineNotFound',
            });
           
        }

        if (!routine) {
            res.status(403).send({
                error: 'PermissionDenied',
                message: 'You do not have permission ',
                name: 'PermissionDenied',
            });
        }

        const updatedRoutine = await updateRoutine({
         id: routineId,
         ...req.body,
            
        });
        if(!updateRoutine){
            res.send({ 
                error: 'NoRoutine',
                message: 'Can not find routine',
                name: 'NoActivityError'
            })
        }

        res.send(updatedRoutine);
    } catch (error) {
        next(error);
    }
});
    
    
    



// DELETE /api/routines/:routineId
router.delete('/:routerId')
// POST /api/routines/:routineId/activities
router.post('/:routineId/activities')
module.exports = router;
