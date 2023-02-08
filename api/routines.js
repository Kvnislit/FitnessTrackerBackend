const express = require('express');
const router = express.Router();

// GET /api/routines
router.get('/routines')
// POST /api/routines
router.post('/routines')
// PATCH /api/routines/:routineId
router.patch('/:routineId')
// DELETE /api/routines/:routineId
router.delete('/:routerId')
// POST /api/routines/:routineId/activities
router.post('/:routineId/activities')
module.exports = router;
