const FacultyServices = require('../services/facultyServices');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
require('dotenv').config();

class FacultyControllers {
  static async getAllTeachers(req, res) {
    try {
      const teachers = await FacultyServices.getAllTeachers();
      res.status(200).json(teachers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getTeacherByF_ID(req, res) {
    try {
      const teacher = await FacultyServices.getTeacherByF_ID(req.params.F_ID);
      if (teacher) {
        res.status(200).json(teacher);
      } else {
        res.status(404).json({ message: 'Faculty not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getTeacherByEmail(req, res) {
    try {
      const teacher = await FacultyServices.getTeacherByEmail(req.params.Email);
      if (teacher) {
        res.status(200).json(teacher);
      } else {
        res.status(404).json({ message: 'Faculty not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createTeacher(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { F_ID, F_NAME, F_DEP, Email, F_NO, Password } = req.body;
    console.log("Received createTeacher request:", req.body); 

    if (!Password) {
      console.log("Password is missing from the request body"); 
      return res.status(400).json({ error: "Password is required" });
    }

    try {
      const existingTeacher = await FacultyServices.getTeacherByEmail(Email);
      if (existingTeacher) {
        console.log("Email already in use:", Email); 
        return res.status(400).json({ error: 'Email already in use' });
      }

      console.log("Hashing password..."); 
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log("Password hashed successfully"); 

      const newTeacher = await FacultyServices.createTeacher({
        F_ID,
        F_NAME,
        F_DEP,
        Email,
        F_NO,
        Password: hashedPassword,
      });
      console.log("New teacher created:", newTeacher); 

      const token = FacultyControllers.generateToken(newTeacher);
      res.status(201).json({ teacher: newTeacher, token });
    } catch (err) {
      console.error("Error creating teacher:", err.message); 
      res.status(500).json({ error: err.message });
    }
  }

  static async login(req, res) {
    const { Email, Password } = req.body;
    try {
      const teacher = await FacultyServices.getTeacherByEmail(Email);
      if (!teacher) {
        return res.status(401).json({ error: 'Invalid Email or password' });
      }

      const isPasswordValid = await FacultyControllers.comparePassword(Password, teacher.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid Email or password' });
      }

      const token = FacultyControllers.generateToken(teacher);
      res.status(200).json({ teacher: { F_ID: teacher.F_ID, Email: teacher.Email }, token });
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async updateTeacher(req, res) {
    const { F_ID } = req.params;
    const { F_NAME, F_DEP, Email, F_NO, Password } = req.body;
    try {
      const existingTeacher = await FacultyServices.getTeacherByEmail(Email);
      if (existingTeacher && existingTeacher.F_ID !== F_ID) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const dataToUpdate = {
        F_NAME,
        F_DEP,
        Email,
        F_NO,
      };

      if (Password) {
        dataToUpdate.Password = await bcrypt.hash(Password, 10);
      }

      const updatedTeacher = await FacultyServices.updateTeacher(F_ID, dataToUpdate);
      res.status(200).json(updatedTeacher);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteTeacher(req, res) {
    const { F_ID } = req.params;
    try {
      await FacultyServices.deleteTeacher(F_ID);
      res.status(200).json({ message: 'Faculty deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async assignFacultyToClass(req, res) {
    const { F_ID, classId } = req.body;
    try {
      const result = await FacultyServices.assignFacultyToClass(F_ID, classId);
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async assignCourseToFaculty(req, res) {
    const { F_ID, courseCode } = req.body;
    try {
      const result = await FacultyServices.assignCourseToFaculty(F_ID, courseCode);
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async removeFacultyFromClass(req, res) {
    const { F_ID, classId } = req.body;
    try {
      const result = await FacultyServices.removeFacultyFromClass(F_ID, classId);
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async removeCourseFromFaculty(req, res) {
    const { F_ID, courseCode } = req.body;
    try {
      const result = await FacultyServices.removeCourseFromFaculty(F_ID, courseCode);
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getCourseByFaculty(req,res){
    try{
      const courses = await FacultyServices.getCoursesForFaculty(req.params.F_ID);
      res.status(200).json({courses});
    }catch(err){
      res.staus(500).json({error:err.message});
    }
  }

  static generateToken(teacher) {
    const payload = { F_ID: teacher.F_ID, role: 'faculty' };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  }
}

module.exports = FacultyControllers;
