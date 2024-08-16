const express = require('express');
const router = express.Router();
const FacultyControllers = require('../controllers/facultyController');

router.get('/', FacultyControllers.getAllTeachers);
router.get('/:F_ID', FacultyControllers.getTeacherByF_ID);
router.post('/', FacultyControllers.createTeacher);
router.put('/:F_ID', FacultyControllers.updateTeacher);
router.delete('/:F_ID', FacultyControllers.deleteTeacher);
router.post('/login', FacultyControllers.login);
router.get('/byEmail/:Email',FacultyControllers.getTeacherByEmail);


router.post('/assignFacultyToClass', FacultyControllers.assignFacultyToClass);
router.post('/removeFacultyFromClass', FacultyControllers.removeFacultyFromClass);

router.post('/assignCourseToFaculty', FacultyControllers.assignCourseToFaculty);
router.post('/removeCourseFromFaculty', FacultyControllers.removeCourseFromFaculty);
router.get('/getCourseByFaculty/:F_ID',FacultyControllers.getCourseByFaculty);

module.exports = router;
