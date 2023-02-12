const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const { getAllPublicRoutines,
    updateRoutine,
    createRoutine,
    getUserByUsername,
    getPublicRoutinesByUser,
    getAllRoutinesByUser,
    getRoutineById,
    destroyRoutine
} = require('../db');
const { UnauthorizedUpdateError } = require('../errors')

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
    const { routineId } = req.params
    const token = req.header('Authorization');
    try {
        if (!token) {
            res.status(401).send({
                error: 'NoToken',
                message: 'You must be logged in to perform this action',
                name: 'NoTokenFound',
            });
        }
        const newToken = token.slice(7)
        const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
        const user = await getUserByUsername(verifiedToken.username)
        const routine = await getRoutineById(routineId);
        if (!routine) {
            res.send({
                error: 'RoutineNotFound',
                message: `The routine with id does not exist`,
                name: 'RoutineNotFound',
            });

        }

        if (user.id !== routine.creatorId) {
            res.status(403).send({
              error: 'PermissionDenied',
              message: `User ${user.username} is not allowed to update ${routine.name}`,
              name: 'PermissionDenied',
            });
          }
      
          const updatedRoutine = await updateRoutine({
            id: routineId,
            ...req.body,
          });
      
          if (!updatedRoutine) {
            res.status(404).send({
              error: 'NoRoutine',
              message: 'Can not update routine',
              name: 'NoRoutineFoundError',
            });
          }
      
          res.send(updatedRoutine);
        } catch (error) {
          next(error);
        }
      });
// DELETE /api/routines/:routineId
router.delete('/:routineId', async (req, res, next) => {
    const { routineId } = req.params;
    const token = req.header('Authorization');
console.log(routineId)
    try {
      if (!token) {
        res.status(401).send({
          error: 'NoToken',
          message: 'You must be logged in to perform this action',
          name: 'NoTokenFound',
        });
      }

      const newToken = token.slice(7);
      const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
      const user = await getUserByUsername(verifiedToken.username);
      const routine = await getRoutineById(routineId);


      if (user.id !== routine.creatorId) {
        res.status(403).send({
          error: 'PermissionDenied',
          message: `User ${user.username} is not allowed to delete ${routine.name}`,
          name: 'PermissionDenied',
        });
      }

      const deletedRoutine = await destroyRoutine({ routineId });

      
      res.send(deletedRoutine);
    } catch (error) {
      next(error);
    }
});

// POST /api/routines/:routineId/activities
router.post('/:routineId/activities')
module.exports = router;
