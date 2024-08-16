const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const facultySchema = new mongoose.Schema({
  F_ID: { type: String, required: true, unique: true },
  F_NAME: { type: String, required: true },
  F_DEP: { type: String, required: true },
  F_NO: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  courseCode: [{ type:String }],
  classId: [{type:String}]
});

facultySchema.virtual('courses',{
  ref:'Course',
  localField:'courseCode',
  foreignField:'courseCode'
});

facultySchema.virtual('classes',{
  ref:'Class',
  localField:'classId',
  foreignField:'classId'
})


const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;
