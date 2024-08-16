const Course = require('../models/course');
const Class = require('../models/class');
const StudentCourseAttendance = require('../models/studentCourseAttendance')

async function getAllCourses() {
  try {
    return await Course.find()
  } catch (error) {
    throw new Error(`Error fetching courses: ${error.message}`);
  }
}

async function getCourseByCourseCode(courseCode) {
  try {
    return await Course.findOne({ courseCode })
  } catch (error) {
    throw new Error(`Error fetching course by code: ${error.message}`);
  }
}

async function createCourse(courseData) {
  try {
    return await Course.create(courseData);
  } catch (error) {
    throw new Error(`Error creating course: ${error.message}`);
  }
}

async function updateCourse(courseCode, courseData) {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { courseCode }, 
      courseData, 
      { new: true }
    )

    if (updatedCourse) {
      return updatedCourse;
    }

    throw new Error('Course not found');
  } catch (error) {
    throw new Error(`Error updating course: ${error.message}`);
  }
}

async function deleteCourse(courseCode) {
  try {
    const deletedCourse = await Course.findOneAndDelete({ courseCode });

    if (deletedCourse) {
      return 'Course deleted successfully';
    }

    throw new Error('Course not found');
  } catch (error) {
    throw new Error(`Error deleting course: ${error.message}`);
  }
}

async function assignCourseToClass(courseCode, classId) {
  try {
    const course = await Course.findOne({ courseCode: courseCode });
    if (!course) throw new Error('Course not found');

    const classToUpdate = await Class.findOne({ classId: classId });
    if (!classToUpdate) throw new Error('Class not found');

    if (!classToUpdate.courseCode.includes(courseCode)) {
      classToUpdate.courseCode.push(courseCode);
    }
    await classToUpdate.save();

    const attendanceRecords = classToUpdate.S_ID.map(studentId => ({
      S_ID: studentId,
      courseCode: courseCode,
      classId: classId,
      attendance: [], 
    }));

    await StudentCourseAttendance.insertMany(attendanceRecords);

    return 'Course assigned to class successfully and attendance records created';
  } catch (err) {
    throw new Error(err.message);
  }
}



async function removeCourseFromClass(courseCode, classId) {
  try {
    const course = await Course.findOne( { courseCode:courseCode });
    if (!course) throw new Error('Course not found');
    
    const classToUpdate = await Class.findOne( { classId:classId });
    if (!classToUpdate) throw new Error('Class not found');

    classToUpdate.courseCode = classToUpdate.courseCode.filter(id => id !== courseCode);
    await classToUpdate.save();

    return 'Course removed from class successfully';
  } catch (err) {
    throw new Error(err.message);
  }
}


module.exports = {
  getAllCourses,
  getCourseByCourseCode,
  createCourse,
  updateCourse,
  deleteCourse,
  assignCourseToClass,
  removeCourseFromClass
};
