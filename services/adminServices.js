const Admin = require('../models/admin');

class AdminServices {
  static async getAllAdmins() {
    try {
      return await Admin.find();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getAdminByA_ID(A_ID) {
    try {
      return await Admin.findOne({ A_ID: A_ID });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getAdminByEmail(email) {
    try {
      return await Admin.findOne({ Email: email });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async createAdmin(data) {
    try {
      return await Admin.create(data);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updateAdmin(A_ID, data) {
    try {
      const updatedAdmin = await Admin.findOneAndUpdate({ A_ID: A_ID }, data, { new: true });
      if (updatedAdmin) {
        return updatedAdmin;
      }
      throw new Error('Admin not found');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deleteAdmin(A_ID) {
    try {
      const deletedAdmin = await Admin.findOneAndDelete({ A_ID: A_ID });
      if (deletedAdmin) {
        return 'Admin deleted';
      }
      throw new Error('Admin not found');
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = AdminServices;
