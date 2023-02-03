const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  // eslint-disable-next-line no-useless-catch
  try {

    const { rows: [routine] } = await client.query(`
    INSERT INTO routines ("creatorId","isPublic",name, goal)
    VALUES($1,$2,$3,$4)
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  // eslint-disable-next-line no-useless-catch
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * FROM routines
    WHERE id = $1
    `, [id])
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  // eslint-disable-next-line no-useless-catch
  try {
    const { rows } = await client.query(`
  SELECT * 
  FROM routines
  `)
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName",routine_activities.id AS "routineActivityId"
      FROM routines
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      JOIN activities ON activities.id = routine_activities."activityId"
      JOIN users ON "creatorId" = users.id
    `);

    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  } catch (error) {
    console.error;
  }
}

async function getAllPublicRoutines() {

}

async function getAllRoutinesByUser({ username }) {

}

async function getPublicRoutinesByUser({ username }) {

}

async function getPublicRoutinesByActivity({ id }) {

}

async function updateRoutine({ id, ...fields }) {

}

async function destroyRoutine(id) {

}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine
};
