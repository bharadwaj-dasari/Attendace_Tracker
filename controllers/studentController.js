const StudentServices = require('../services/studentServices');
const ClassServices = require('../services/classServices');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Papa = require('papaparse');
const fs = require('fs');
require('dotenv').config();

class StudentControllers {
  static async getAllStudents(req, res) {
    try {
      const students = await StudentServices.getAllStudents();
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getStudentByS_ID(req, res) {
    try {
      const student = await StudentServices.getStudentByS_ID(req.params.S_ID);
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ error: 'Student Not Found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getStudentByEmail(req,res){
    const Email = req.params.Email;
    const student = await StudentServices.getStudentByEmail(Email);
    if(student){
      res.status(200).json(student);
    }else{
      res.status(404).json({error:'Student Not Found'});
    }
  }catch(err){
    res.status(500).json({error:err.message});
  }

  static async createStudent(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Email, Password, S_ID, S_NAME, SECTION, SEM, S_PNO } = req.body;
    try {
      const existingStudent = await StudentServices.getStudentByEmail(Email);
      if (existingStudent) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(Password, 10);
      const newStudent = await StudentServices.createStudent({
        Email,
        Password: hashedPassword,
        S_ID,
        S_NAME,
        SECTION,
        SEM,
        S_PNO,
      });

      const token = StudentControllers.generateToken(newStudent);
      res.status(201).json({ student: newStudent, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateStudent(req, res) {
    const { Email, Password, S_ID, S_NAME, SECTION, SEM, S_PNO } = req.body;
    try {
      const updateData = {};
      if (Email) updateData.Email = Email;
      if (Password) updateData.Password = await bcrypt.hash(Password, 10);
      if (S_ID) updateData.S_ID = S_ID;
      if (S_NAME) updateData.S_NAME = S_NAME;
      if (SECTION) updateData.SECTION = SECTION;
      if (SEM) updateData.SEM = SEM;
      if (S_PNO) updateData.S_PNO = S_PNO;

      const updatedStudent = await StudentServices.updateStudent(req.params.S_ID, updateData);

      if (updatedStudent) {
        res.status(200).json(updatedStudent);
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const deletedStudent = await StudentServices.deleteStudent(req.params.S_ID);
      if (deletedStudent) {
        res.status(200).json(deletedStudent);
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getStudentBySemAndSection(req, res) {
    const { SEM, SECTION } = req.body;
    try {
      const students = await StudentServices.getStudentsBySemAndSection(SEM, SECTION);
      if (students.length > 0) {
        res.status(200).json(students);
      } else {
        res.status(404).json({ error: 'No students found for the given SEM and SECTION' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async login(req, res) {
    const { Email, Password } = req.body;
    try {
      const student = await StudentServices.getStudentByEmail(Email);
      if (!student) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await StudentControllers.comparePassword(Password, student.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = StudentControllers.generateToken(student);
      res.status(200).json({ student: { S_ID: student.S_ID, Email: student.Email }, token });
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createBulkStudents(req, res) {
    try {
      const file = req.file; 
      if (!file) {
        return res.status(400).json({ error: 'CSV file required' });
      }

      const csvData = fs.readFileSync(file.path, 'utf-8');
      const parsedData = Papa.parse(csvData, { header: true });
      
      const students = parsedData.data.map(student => ({
        Email: student.Email,
        Password: bcrypt.hashSync(student.Password, 10), 
        S_ID: student.S_ID,
        S_NAME: student.S_NAME,
        SECTION: student.SECTION,
        SEM: student.SEM,
        S_PNO: student.S_PNO,
      }));

      const newStudents = await StudentServices.createBulkStudents(students);
      res.status(201).json(newStudents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(student) {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not set');
    }

    return jwt.sign({ S_ID: student.S_ID, Email: student.Email }, secretKey, { expiresIn: '1h' });
  }
}

module.exports = StudentControllers;
