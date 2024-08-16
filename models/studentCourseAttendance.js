const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: {type: Date,required: true},
  status: {type: String,enum: ['Present', 'Absent'],required: true}
});

const StudentCourseAttendanceSchema = new mongoose.Schema({
  S_ID: {type: String,required: true},
  courseCode: {type: String,required: true},
  classId: {type: String,required: true},
  attendance: [AttendanceSchema]
});


StudentCourseAttendanceSchema.virtual('Students', {
  ref: 'Student',
  localField: 'S_ID',
  foreignField: 'S_ID'
});

StudentCourseAttendanceSchema.virtual('Courses', {
  ref: 'Course',
  localField: 'courseCode',
  foreignField: 'courseCode'
});

StudentCourseAttendanceSchema.virtual('Classes', {
  ref: 'Class',
  localField: 'classId',
  foreignField: 'classId'
});


const StudentCourseAttendance = mongoose.model('StudentCourseAttendance', StudentCourseAttendanceSchema);

module.exports = StudentCourseAttendance;
