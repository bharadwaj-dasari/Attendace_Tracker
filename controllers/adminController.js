const AdminServices = require('../services/adminServices');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
require('dotenv').config();

class AdminControllers {
  static async getAllAdmins(req, res) {
    try {
      const admins = await AdminServices.getAllAdmins();
      res.status(200).json(admins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAdminByA_ID(req, res) {
    try {
      const admin = await AdminServices.getAdminByA_ID(req.params.A_ID);
      if (admin) {
        res.status(200).json(admin);
      } else {
        res.status(404).json({ error: 'Admin Not Found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAdminByEmail(req,res){
    try{
      const admin = await AdminServices.getAdminByEmail(req.params.Email);
      if(admin){
        res.status(200).json(admin);
        }else{
          res.status(404).json({error:'Admin Not Found'});
      }
    }catch(err){
     res.status(500).json({error:err.messange}); 
    }
  }

  static async createAdmin(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { A_NAME, Email, Password } = req.body;
    try {
      const existingAdmin = await AdminServices.getAdminByEmail(Email);
      if (existingAdmin) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      const hashedPassword = await bcrypt.hash(Password, 10);
      const newAdmin = await AdminServices.createAdmin({  A_NAME, Email, Password:hashedPassword });
      const token = AdminControllers.generateToken(newAdmin);
      res.status(201).json({ admin: newAdmin, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateAdmin(req, res) {
    const {  A_NAME, Email, Password } = req.body;
    try {
      const updatedAdmin = await AdminServices.updateAdmin(req.params.A_ID, {  A_NAME, Email, Password });
      if (updatedAdmin) {
        res.status(200).json(updatedAdmin);
      } else {
        res.status(404).json({ message: 'Admin not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteAdmin(req, res) {
    try {
      const deletedAdmin = await AdminServices.deleteAdmin(req.params.A_ID);
      if (deletedAdmin) {
        res.status(200).json({ message: 'Admin deleted' });
      } else {
        res.status(404).json({ error: 'Admin not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async login(req, res) {
    const { Email, Password } = req.body;
    try {
      const admin = await AdminServices.getAdminByEmail(Email);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid Email or password' });
      }

      const isPasswordValid = await bcrypt.compare(Password, admin.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid Email or password' });
      }

      const token = AdminControllers.generateToken(admin);
      res.status(200).json({ admin: { A_ID: admin.A_ID, A_NAME: admin.A_NAME, Email: admin.Email }, token });
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static generateToken(admin) {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not set');
    }

    return jwt.sign({ A_ID: admin.A_ID, Email: admin.Email }, secretKey, { expiresIn: '1h' });
  }
}

module.exports = AdminControllers;
