const express = require('express');
const router = express.Router();
const AdminControllers = require('../controllers/adminController');
const { body } = require('express-validator');

router.get('/', AdminControllers.getAllAdmins);
router.get('/:A_ID', AdminControllers.getAdminByA_ID);
router.post(
  '/',
  [
    body('A_NAME').notEmpty().withMessage('Admin Name is required'),
    body('Email').isEmail().withMessage('Valid Email is required'),
    body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  AdminControllers.createAdmin
);
router.put('/:A_ID', AdminControllers.updateAdmin);
router.get('/byEmail/:Email',AdminControllers.getAdminByEmail);
router.delete('/:A_ID', AdminControllers.deleteAdmin);
router.post('/login', AdminControllers.login);

module.exports = router;
