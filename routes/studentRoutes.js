const express = require('express');
const router = express.Router();
const StudentControllers = require('../controllers/studentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Papa = require('papaparse');
const fs = require('fs');

router.get('/', StudentControllers.getAllStudents);
router.get('/:S_ID', StudentControllers.getStudentByS_ID);
router.get('/byEmail/:Email',StudentControllers.getStudentByEmail);
router.post('/', StudentControllers.createStudent);
router.put('/:S_ID', StudentControllers.updateStudent);
router.delete('/:S_ID', StudentControllers.deleteStudent);
router.post('/login', StudentControllers.login);
router.get('/:SEM/:SECTION',StudentControllers.getStudentBySemAndSection);


module.exports = router;
