
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUserByUsername,
  getRoutineById,
  updateRoutineActivity,
  destroyRoutine,
  getRoutineActivityById, } = require('../db');


// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
  try {
    const { count, duration } = req.body;
    const token = req.header('Authorization');

    const newToken = token.slice(7);
    const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
    const user = await getUserByUsername(verifiedToken.username);
    const routineActivityId = req.params.routineActivityId;
    const routineActivity = await getRoutineById(routineActivityId);
    
    if (!routineActivity) {
      res.status(404).send({
        error: 'RoutineActivityNotFound',
        message: `The routine activity with id does not exist`,
        name: 'RoutineActivityNotFound',
      });
    } else if (routineActivity.creatorId !== user.id) {
      res.status(403).send({
        error: 'NoRoutineActivity',
        message: `User ${user.username} is not allowed to update ${routineActivity.name}`,
        name: 'NoRoutineActivity',
      });
    } else {
      const updatedRoutineActivity = await updateRoutineActivity({
        id: routineActivityId,
        count,
        duration,
      });
      res.send(updatedRoutineActivity);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {

  const token = req.header('Authorization');
  const newToken = token.slice(7);
  const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET);
  const user = await getUserByUsername(verifiedToken.username);

  const routineActivityId = req.params.routineActivityId;

  const routineActivity = await getRoutineActivityById(routineActivityId);
  const routine = await getRoutineById(routineActivity.routineId)
  console.log(routineActivity)

  if (!routineActivity) {
    res.status(404).send({
      error: 'RoutineActivityNotFound',
      message: `The routine activity with id ${routineActivityId} does not exist`,
      name: 'RoutineActivityNotFound',
    });
  }
  else if (routine.creatorId !== user.id) {
    res.status(403).send({
      error: 'NoRoutineActivity',
      message: `User ${user.username} is not allowed to delete ${routine.name}`,
      name: 'NoRoutineActivity',
    });
  }
  else {

    await destroyRoutine(routineActivity.routineId);

    res.send(
      routineActivity
    );
  }
});

module.exports = router;
