const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceControllers');

router.post('/', attendanceController.createAttendanceRecord);
router.get('/:S_ID/:courseCode/:classId',attendanceController.getAttendanceRecord);
router.get('/student/:S_ID', attendanceController.getAttendanceForStudent);
router.get('/course/:courseCode/class/:classId', attendanceController.getAttendanceForCourseClass);
router.put('/update/:S_ID/:courseCode/:classId', attendanceController.updateAttendanceRecord);
router.delete('/delete/:S_ID/:courseCode/:classId', attendanceController.deleteAttendanceRecord);
router.post('/mark/:S_ID/:courseCode/:classId', attendanceController.markAttendance);

module.exports = router;
