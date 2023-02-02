const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // eslint-disable-next-line no-useless-catch
  try {
    const {rows: [activity]} = await client.query(`
      INSERT INTO activities (name , description)
      VALUES($1, $2)
      RETURNING *
    `, [name, description]);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  // eslint-disable-next-line no-useless-catch
  try{
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities`
    )
  return rows;
}catch(error){
  throw error;
}
}

async function getActivityById(id) {
  // eslint-disable-next-line no-useless-catch
  try {
    const {rows: [user]} = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE id = ${id}
    `);
    return user
  }catch(error){
    throw error
  }
}

async function getActivityByName(name) {
  
    const {rows: [user]} = await client.query(`
    SELECT * FROM activities 
    WHERE name = $1
    `,[name]);
    
    return user;

}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  return getAllActivities()
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setFields = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    
    
    try {
      const { rows: [activity] } = await client.query(`
      UPDATE activities
      SET ${setFields}
      WHERE id = ${id}
      RETURNING *
      ` , Object.values(fields));
    return activity;
  } catch (error) {
  console.error(error)    
  }

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
