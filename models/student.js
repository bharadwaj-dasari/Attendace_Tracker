const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  S_ID: { type: String, required: true, unique: true },
  S_NAME: { type: String, required: true },
  SECTION: { type: String, required: true },
  SEM: { type: Number, required: true },
  S_PNO: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
