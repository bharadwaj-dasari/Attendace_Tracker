const Student = require('../models/student');
const Class = require('../models/class');

class StudentServices {
  static async getAllStudents() {
    try {
      return await Student.find();
    } catch (err) {
      throw new Error(`Error fetching students: ${err.message}`);
    }
  }

  static async getStudentByS_ID(S_ID) {
    try {
      return await Student.findOne({ S_ID });
    } catch (err) {
      throw new Error(`Error fetching student by S_ID: ${err.message}`);
    }
  }

  static async getStudentByEmail(Email) {
    try {
      return await Student.findOne({ Email });
    } catch (err) {
      throw new Error(`Error fetching student by email: ${err.message}`);
    }
  }

  static async createStudent(data) {
    const { SEM, SECTION, S_ID, ...otherStudentData } = data;

    try {
      const student = new Student({
        S_ID,
        SEM,
        SECTION,
        ...otherStudentData
      });

      await student.save();

      let classObj = await Class.findOne({ SEM, SECTION });
      if (classObj) {
        if (!classObj.S_ID.includes(S_ID)) {
          classObj.S_ID.push(S_ID);
          await classObj.save();
        } else {
          throw new Error('Student already exists in class');
        }
      } else {
        const newClass = new Class({
          SEM,
          SECTION,
          S_ID: [S_ID]
        });
        await newClass.save();
      }

      return student;
    } catch (err) {
      throw new Error(`Error creating student and assigning to class: ${err.message}`);
    }
  }

  static async updateStudent(S_ID, data) {
    try {
      const student = await Student.findOne({ S_ID });
      if (!student) {
        throw new Error('Student not found');
      }

      const updatedStudent = await Student.findOneAndUpdate(
        { S_ID },
        data,
        { new: true }
      );

      if (data.SEM !== undefined || data.SECTION !== undefined) {
        const oldSEM = student.SEM;
        const oldSECTION = student.SECTION;
        const newSEM = data.SEM !== undefined ? data.SEM : student.SEM;
        const newSECTION = data.SECTION !== undefined ? data.SECTION : student.SECTION;

        let oldClass = await Class.findOne({ SEM: oldSEM, SECTION: oldSECTION });
        if (oldClass) {
          oldClass.S_ID = oldClass.S_ID.filter(id => id !== S_ID);
          if (oldClass.S_ID.length === 0) {
            await Class.findOneAndDelete({ SEM: oldSEM, SECTION: oldSECTION });
          } else {
            await oldClass.save();
          }
        }

        let newClass = await Class.findOne({ SEM: newSEM, SECTION: newSECTION });
        if (newClass) {
          if (!newClass.S_ID.includes(S_ID)) {
            newClass.S_ID.push(S_ID);
            await newClass.save();
          }
        } else {
          const newClassObj = new Class({
            SEM: newSEM,
            SECTION: newSECTION,
            S_ID: [S_ID]
          });
          await newClassObj.save();
        }
      }

      return updatedStudent;
    } catch (err) {
      throw new Error(`Error updating student: ${err.message}`);
    }
  }

  static async deleteStudent(S_ID) {
    try {
      const student = await Student.findOne({ S_ID });
      if (!student) {
        throw new Error('Student not found');
      }

      await Student.findOneAndDelete({ S_ID });

      const classObj = await Class.findOne({ SEM: student.SEM, SECTION: student.SECTION });
      if (classObj) {
        classObj.S_ID = classObj.S_ID.filter(id => id !== S_ID);
        if (classObj.S_ID.length === 0) {
          await Class.findOneAndDelete({ SEM: student.SEM, SECTION: student.SECTION });
          console.log(`Class with SEM: ${student.SEM} and SECTION: ${student.SECTION} has been deleted as it is empty.`);
        } else {
          await classObj.save();
          console.log(`Student ${S_ID} removed from class with SEM: ${student.SEM} and SECTION: ${student.SECTION}.`);
        }
      } else {
        console.log(`No class found for SEM: ${student.SEM} and SECTION: ${student.SECTION}.`);
      }

      return 'Student deleted successfully';
    } catch (err) {
      throw new Error(`Error deleting student: ${err.message}`);
    }
  }

  static async getStudentsBySemAndSection(SEM, SECTION) {
    try {
      return await Student.find({ SEM, SECTION });
    } catch (err) {
      throw new Error(`Error fetching students by semester and section: ${err.message}`);
    }
  }
}

module.exports = StudentServices;
