const mongoose = require('mongoose');

// Counter
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, required: true }
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}

// Admin
const adminSchema = new mongoose.Schema({
  A_ID: { type: Number, unique: true, index: true },
  A_NAME: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true }
});

adminSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      this.A_ID = await getNextSequenceValue('adminId');
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
