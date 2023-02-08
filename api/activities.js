const express = require('express');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines')
// GET /api/activities
router.get('/activities')
// POST /api/activities
router.post('/activites')
// PATCH /api/activities/:activityId
router.patch(':activityId/routines')
module.exports = router;
