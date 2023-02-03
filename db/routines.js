const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

const allRoutines = `
SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName",routine_activities.id AS "routineActivityId"
FROM routines
JOIN routine_activities ON routines.id = routine_activities."routineId"
JOIN activities ON activities.id = routine_activities."activityId"
JOIN users ON "creatorId" = users.id
`;

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
    const { rows } = await client.query(allRoutines);
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  } catch (error) {
    console.error;
  }
}

async function getAllPublicRoutines() {
  try{
    const { rows } = await client.query(`
    ${allRoutines}
    WHERE "isPublic" = true
    `);
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;

  }catch(error){
    console.error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try{
    const { rows } = await client.query(`
    ${allRoutines}
    WHERE username = $1
    `,[username]);
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;

  }catch(error){
    console.error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try{
    const { rows } = await client.query(`
    ${allRoutines}
    WHERE username = $1 AND "isPublic" = true 
    `,[username]);
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;

  }catch(error){
    console.error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try{
    const { rows } = await client.query(`
    ${allRoutines}
    WHERE "activityId" = $1 AND "isPublic" = true
    `,[id]);
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;

  }catch(error){
    console.error;
  }
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
