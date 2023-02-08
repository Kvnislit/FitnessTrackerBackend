const express = require('express');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId')
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId')

module.exports = router;
