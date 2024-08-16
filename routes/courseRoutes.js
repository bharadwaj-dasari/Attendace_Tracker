const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/:courseCode', courseController.getCourseByCourseCode);
router.post('/', courseController.createCourse);
router.put('/:courseCode', courseController.updateCourse);
router.delete('/:courseCode', courseController.deleteCourse);


router.post('/assignCourseToClass', courseController.assignCourseToClass);
router.post('/removeCourseFromClass', courseController.removeCourseFromClass);

module.exports = router;
