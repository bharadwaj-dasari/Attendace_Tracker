const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  classId:{},
  SEM: { type: Number, required: true },
  SECTION: { type: String, required: true },
  S_ID: [{ type: String }],
  F_ID: [{ type: String }],
  courseCode: [{ type: String }],
});


//linking
classSchema.virtual('students', {
  ref: 'Student',
  localField: 'S_ID',
  foreignField: 'S_ID',
  justOne: false
});

classSchema.virtual('faculties', {
  ref: 'Faculty',
  localField: 'F_ID',
  foreignField: 'F_ID',
  justOne: false
});

classSchema.virtual('courses', {
  ref: 'Course',
  localField: 'courseCode',
  foreignField: 'courseCode',
  justOne: false
});

classSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('SEM') || this.isModified('SECTION')) {
    this.classId = `${this.SEM}-${this.SECTION}`;
  }
  next();
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
