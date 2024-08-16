const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseTitle: { type: String, required: true },
  courseType: { type: String, enum: ['Core', 'Elective'], required: true },
  F_ID: [{ type: String}],
});

courseSchema.virtual('faculties',{
  ref:'faculty',
  localField:'F_ID',
  foreignField:'F_ID'
})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
