/* eslint-disable no-useless-catch */
const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    
  const { rows: [routineActivity] } = await client.query(`
  INSERT INTO routine_activities ("routineId","activityId",count,duration)
  VALUES($1,$2,$3,$4)
  ON CONFLICT ("routineId","activityId") DO NOTHING
  RETURNING *
  `, [routineId, activityId, count, duration])
  return routineActivity;
} catch (error) {
  throw error;
}
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [activities] } = await client.query(`
      SELECT * FROM routine_activities 
      WHERE id = $1
    `, [id]);
    return activities;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routine_activities
      WHERE "routineId" = $1
    `, [id]);
    return rows;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setActivity =  Object.keys(fields).map(
      (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

   try {
    if (setActivity.length > 0) {
      const { rows:[activity] } = await client.query(`
      UPDATE routine_activities 
      SET ${setActivity} 
      WHERE id=${id} 
      RETURNING *;`, 
    Object.values(fields));
    return activity;
    }
  } catch (error) {
  console.error(error);
  }}


async function destroyRoutineActivity(id) {
 
}
  



async function canEditRoutineActivity(routineActivityId, userId) {

}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
