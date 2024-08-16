const StudentCourseAttendance = require('../models/studentCourseAttendance');

class AttendanceService {
  async createAttendanceRecord(S_ID, courseCode, classId) {
    const existingRecord = await StudentCourseAttendance.findOne({
      S_ID: S_ID,
      courseCode: courseCode,
      classId: classId
    });

    if (existingRecord) {
      throw new Error('Attendance record already exists');
    }

    const newAttendanceRecord = new StudentCourseAttendance({
      S_ID: S_ID,
      courseCode: courseCode,
      classId: classId,
      attendance: []  
    });

    await newAttendanceRecord.save();
    return newAttendanceRecord;
  }

  async getAttendanceRecord(S_ID, courseCode, classId) {
    const record = await StudentCourseAttendance.findOne({
      S_ID: S_ID,
      courseCode: courseCode,
      classId: classId
    });
    if (!record) {
      throw new Error('Attendance record not found');
    }
    return record;
  }

  async getAttendanceForStudent(S_ID) {
    return await StudentCourseAttendance.find({ S_ID: S_ID }).populate('courseCode').populate('classId');
  }

  async getAttendanceForCourseClass(courseCode, classId) {
    return await StudentCourseAttendance.find({ courseCode: courseCode, classId: classId }).populate('S_ID').populate('classId');
  }

  async updateAttendanceRecord(S_ID, courseCode, classId, date, status) {
    const attendanceRecord = await StudentCourseAttendance.findOne({
      S_ID: S_ID,
      courseCode: courseCode,
      classId: classId
    });
  
    if (!attendanceRecord) {
      return null;
    }
    const normalizedDate = new Date(date).toISOString();
    const attendanceEntryIndex = attendanceRecord.attendance.findIndex(entry => new Date(entry.date).toISOString() === normalizedDate);
    if (!attendanceEntryIndex) {
      return null;
    }
  
    attendanceRecord.attendance.splice(attendanceEntryIndex, 1);
  
    await attendanceRecord.save();
    return attendanceRecord;
  }
  

  async deleteAttendanceRecord(S_ID, courseCode, classId, date) {
    console.log(`Looking for attendance record with S_ID: ${S_ID}, courseCode: ${courseCode}, classId: ${classId}`);
    
    const attendanceRecord = await StudentCourseAttendance.findOne({
      S_ID: S_ID,
      courseCode: courseCode,
      classId: classId
    });
  
    if (!attendanceRecord) {
      console.log('Attendance record not found');

    }
  
    console.log('Attendance record found:', attendanceRecord);
  
    const normalizedDate = new Date(date).toISOString();
  
    const attendanceEntryIndex = attendanceRecord.attendance.findIndex(entry => new Date(entry.date).toISOString() === normalizedDate);
    if (attendanceEntryIndex === -1) {
      console.log('Attendance entry not found for date:', date);
    }
  
    console.log('Attendance entry found at index:', attendanceEntryIndex);
  
    attendanceRecord.attendance.splice(attendanceEntryIndex, 1);
  
    await attendanceRecord.save();
    return attendanceRecord;
  }
  
  

  async markAttendance(S_ID, courseCode, classId, date, status) {
    const attendanceRecord = await StudentCourseAttendance.findOne({
      S_ID: S_ID,
      courseCode: courseCode,
      classId: classId
    });
  
    if (!attendanceRecord) {
      return null;
    }
  
    const existingEntry = attendanceRecord.attendance.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.status = status;
    } else {
      attendanceRecord.attendance.push({ date, status });
    }
  
    await attendanceRecord.save();
    return attendanceRecord;
  }
  
}

module.exports = new AttendanceService();
