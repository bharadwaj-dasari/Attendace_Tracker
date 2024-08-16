const Faculty = require('../models/faculty');
const Course = require('../models/course');
const Class = require('../models/class');

class FacultyServices {
  static async getAllTeachers() {
    try {
      return await Faculty.find();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getTeacherByF_ID(F_ID) {
    try {
      return await Faculty.findOne({ F_ID: F_ID });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getTeacherByEmail(Email) {
    try {
      return await Faculty.findOne({ Email: Email });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async createTeacher(data) {
    try {
      return await Faculty.create(data);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updateTeacher(F_ID, data) {
    try {
      const updatedTeacher = await Faculty.findOneAndUpdate(
        { F_ID: F_ID },
        data,
        { new: true }
      );
      if (updatedTeacher) {
        return updatedTeacher;
      }
      throw new Error('Faculty not found');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deleteTeacher(F_ID) {
    try {
      const deletedTeacher = await Faculty.findOneAndDelete({ F_ID: F_ID });
      if (deletedTeacher) {
        return 'Faculty deleted';
      }
      throw new Error('Faculty not found');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getCoursesForFaculty(F_ID) {
    try {
      const faculty = await Faculty.findOne({ F_ID: F_ID }).populate('courses', 'courseCode');
      if (!faculty) throw new Error('Faculty not found');
      
      return faculty.courses.map(course => course.courseCode);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async assignFacultyToClass(F_ID, classId) {
    try {
      const faculty = await Faculty.findOne({ F_ID: F_ID });
      if (!faculty) throw new Error('Faculty not found');
      
      const classToUpdate = await Class.findOne({ classId: classId });
      if (!classToUpdate) throw new Error('Class not found');

      if (!classToUpdate.F_ID.includes(F_ID)) {
        classToUpdate.F_ID.push(F_ID);
      }
      await classToUpdate.save();

      if (!faculty.classId.includes(classId)) {
        faculty.classId.push(classId);
      }

      const courseCodes = classToUpdate.courseCode;
      courseCodes.forEach((code) => {
        if (!faculty.courseCode.includes(code)) {
          faculty.courseCode.push(code);
        }
      });
      await faculty.save();

      return 'Faculty assigned to class successfully';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async assignCourseToFaculty(F_ID, courseCode) {
    try {
      const faculty = await Faculty.findOne({ F_ID: F_ID });
      if (!faculty) throw new Error('Faculty not found');
      
      const courseToUpdate = await Course.findOne({ courseCode: courseCode });
      if (!courseToUpdate) throw new Error('Course not found');
      if (faculty.courseCode.includes(courseCode)) {
        throw new Error('Course already assigned to faculty');
      }
      
      faculty.courseCode.push(courseCode);
      await faculty.save();
  
      if (!courseToUpdate.F_ID.includes(F_ID)) {
        courseToUpdate.F_ID.push(F_ID);
      }
      await courseToUpdate.save();
  
      return 'Course assigned to faculty successfully';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async removeFacultyFromClass(F_ID, classId) {
    try {
      const faculty = await Faculty.findOne({ F_ID: F_ID });
      if (!faculty) throw new Error('Faculty not found');
      
      const classToUpdate = await Class.findOne({ classId: classId });
      if (!classToUpdate) throw new Error('Class not found');

      classToUpdate.F_ID = classToUpdate.F_ID.filter(id => id !== F_ID);
      await classToUpdate.save();

      faculty.classId = faculty.classId.filter(id => id !== classId);

      const courseCodes = classToUpdate.courseCode.map(code => code.toString());
      faculty.courseCode = faculty.courseCode.filter(code => !courseCodes.includes(code));
      await faculty.save();

      return 'Faculty removed from class successfully';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async removeCourseFromFaculty(F_ID, courseCode) {
    try {
      const faculty = await Faculty.findOne({ F_ID: F_ID });
      if (!faculty) throw new Error('Faculty not found');
      
      const courseToUpdate = await Course.findOne({ courseCode: courseCode });
      if (!courseToUpdate) throw new Error('Course not found');

      faculty.courseCode = faculty.courseCode.filter(code => code !== courseCode);
      await faculty.save();

      courseToUpdate.F_ID = courseToUpdate.F_ID.filter(id => id !== F_ID);
      await courseToUpdate.save();

      return 'Course removed from faculty successfully';
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = FacultyServices;
