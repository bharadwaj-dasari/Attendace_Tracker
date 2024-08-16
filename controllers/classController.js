const ClassServices = require('../services/classServices');
const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

class ClassControllers {
  static async getAllClasses(req, res) {
    try {
      const classes = await ClassServices.getAllClasses();
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getClassByClassId(req, res) {
    const { classId } = req.params;
    try {
      const classData = await ClassServices.getClassByClassId(classId);
      if (classData) {
        res.status(200).json(classData);
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createClass(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { SEM,SECTION} = req.body;
    try {
      const newClass = await ClassServices.createClass({ SEM,SECTION});
      res.status(201).json(newClass);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateClass(req, res) {
    const { classId } = req.params;
    const { SEM,SECTION} = req.body;
    try {
      const updatedClass = await ClassServices.updateClass(classId, { SEM,SECTION});
      if (updatedClass) {
        res.status(200).json(updatedClass);
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteClass(req, res) {
    const { classId } = req.params;
    try {
      const deletedClass = await ClassServices.deleteClass(classId);
      if (deletedClass) {
        res.status(200).json(deletedClass);
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async assignStudentsToClass(req, res) {
    const { classId } = req.params;
    const { studentIds } = req.body;
    try {
      const updatedClass = await ClassServices.assignStudentsToClass(classId, studentIds);
      if (updatedClass) {
        res.status(200).json(updatedClass);
      } else {
        res.status(404).json({ error: 'Class or students not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getCoursesByClassId(req,res){
    const {classId} = req.params;
    try{
      const classData = await ClassServices.getCoursesByClass(classId);
      if(classData){
        res.status(200).json(classData);
        }else{
          res.staus(404).json({error:'Class not found'});       
        }
        }catch(err){
          res.status(500).json({error:err.message});
          }
  }
}
module.exports = ClassControllers;
