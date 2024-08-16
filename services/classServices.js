const Class = require('../models/class');

class ClassServices {
  static async getAllClasses() {
    try {
      return await Class.find();
    } catch (err) {
      throw new Error(`Error fetching classes: ${err.message}`);
    }
  }

  static async getClassBySemAndSection(SEM, SECTION) {
    try {
      return await Class.findOne({ SEM, SECTION });
    } catch (err) {
      throw new Error(`Error fetching class by semester and section: ${err.message}`);
    }
  }
  
  static async getClassByClassId(classId){
    try{
      return await Class.findOne({classId});
    }catch(err){
       throw new Error(`Error fetching class by classId:${err.message}`);
    }
  }
  static async createClass(data) {
    try {
      const existingClass = await Class.findOne({ SEM: data.SEM, SECTION: data.SECTION });
      if (existingClass) {
        throw new Error('Class already exists');
      }

      const newClass = new Class(data);
      await newClass.save();
      return newClass;
    } catch (err) {
      throw new Error(`Error creating class: ${err.message}`);
    }
  }

  static async updateClass(id, data) {
    try {
      const updatedClass = await Class.findOneAndUpdate({ id }, data, { new: true });
      if (!updatedClass) {
        throw new Error('Class not found');
      }
      return updatedClass;
    } catch (err) {
      throw new Error(`Error updating class: ${err.message}`);
    }
  }

  static async deleteClass(classId) {
    try {
      const classObj = await Class.findOneAndDelete({ classId });
      if (!classObj) {
        throw new Error('Class not found');
      }
      return 'Class deleted successfully';
    } catch (err) {
      throw new Error(`Error deleting class: ${err.message}`);
    }
  }

  static async getCoursesByClass(classId) {
    try {
      const classObj = await Class.findOne({ classId: classId }).populate('courses', 'courseCode');
      if (!classObj) throw new Error('Class not found');
      
      return Class.courses.map(course => course.courseCode);
    } catch (err) {
      throw new Error(err.message);
    }
}
}

  

module.exports = ClassServices;
