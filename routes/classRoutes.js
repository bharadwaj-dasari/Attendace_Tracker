const express = require('express');
const router = express.Router();
const ClassControllers = require('../controllers/classController');

router.get('/', ClassControllers.getAllClasses);
router.get('/:classId', ClassControllers.getClassByClassId);
router.post('/', ClassControllers.createClass);
router.put('/:classId', ClassControllers.updateClass);
router.delete('/:classId', ClassControllers.deleteClass);

router.get('/',ClassControllers.getCoursesByClassId);
module.exports = router;
