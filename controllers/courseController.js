const CourseServices = require('../services/courseServices');

class CourseController {
  static async getAllCourses(req, res) {
    try {
      const courses = await CourseServices.getAllCourses();
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getCourseByCourseCode(req, res) {
    try {
      const course = await CourseServices.getCourseByCourseCode(req.params.courseCode);
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createCourse(req, res) {
    const { courseCode, courseTitle, courseType } = req.body;
    if (!courseCode || !courseTitle || !courseType) {
      return res.status(400).json({ error: 'All required fields must be provcourseCodeed' });
    }
  
    try {
      const existingCourse = await CourseServices.getCourseByCourseCode(courseCode);
      if (existingCourse) {
        return res.status(400).json({ error: 'Course code already in use' });
      }
  
      const newCourse = await CourseServices.createCourse({ courseCode, courseTitle, courseType });
      res.status(201).json(newCourse);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

  static async updateCourse(req, res) {
    const { courseCode, courseTitle, courseType} = req.body;
    try {
      const updatedCourse = await CourseServices.updateCourse(req.params.courseCode, { courseCode, courseTitle, courseType });
      if (updatedCourse) {
        res.status(200).json(updatedCourse);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteCourse(req, res) {
    try {
      const deletedCourse = await CourseServices.deleteCourse(req.params.courseCode);
      res.status(200).json({ deletedCourse });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  
  static async assignCourseToClass(req, res) {
    try {
      const { courseCode, classId } = req.body;
      const result = await CourseServices.assignCourseToClass(courseCode, classId);
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  static async removeCourseFromClass(req, res) {
    try {
      const { courseCode, classId } = req.body;
      const result = await CourseServices.removeCourseFromClass(courseCode, classId);
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = CourseController;
