const attendanceService = require('../services/attendanceServices');

class AttendanceControllers {
  static async createAttendanceRecord(req, res) {
    try {
      const { S_ID, courseCode, classId } = req.body;
      const newAttendanceRecord = await attendanceService.createAttendanceRecord(S_ID, courseCode, classId);
      res.status(201).json({ message: 'Attendance record created successfully', newAttendanceRecord });
    } catch (error) {
      res.status(500).json({ message: 'Error creating attendance record', error: error.message });
    }
  }

  static async getAttendanceForStudent(req, res) {
    try {
      const { S_ID } = req.params;
      const attendanceRecords = await attendanceService.getAttendanceForStudent(S_ID);
      res.status(200).json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
    }
  }

  static async getAttendanceForCourseClass(req, res) {
    try {
      const { courseCode, classId } = req.params;
      const attendanceRecords = await attendanceService.getAttendanceForCourseClass(courseCode, classId);
      res.status(200).json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
    }
  }

  static async getAttendanceRecord(req, res) {
    try {
      const { S_ID, courseCode, classId } = req.params;
      const attendanceRecord = await attendanceService.getAttendanceRecord(S_ID, courseCode, classId);
      res.status(200).json(attendanceRecord);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance record', error: error.message });
    }
  }

  static async updateAttendanceRecord(req, res) {
    try {
      const { S_ID, courseCode, classId } = req.params;
      const { date, status } = req.body;
      const updatedAttendanceRecord = await attendanceService.updateAttendanceRecord(S_ID, courseCode, classId, date, status);
      if (!updatedAttendanceRecord) {
        return res.status(404).json({ message: 'Attendance entry not found' });
      }
      res.status(200).json(updatedAttendanceRecord);
    } catch (error) {
      res.status(500).json({ message: 'Error updating attendance record', error: error.message });
    }
  }
  
  

  static async deleteAttendanceRecord(req, res) {
    try {
      const { S_ID, courseCode, classId } = req.params;
      const { date } = req.body;
      const deletedAttendanceRecord = await attendanceService.deleteAttendanceRecord(S_ID, courseCode, classId, date);
      if (!deletedAttendanceRecord) {
        return res.status(404).json({ message: 'Attendance entry not found' });
      }
      res.status(200).json({ message: 'Attendance record deleted successfully', deletedAttendanceRecord });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting attendance record', error: error.message });
    }
  }
  
  

  static async markAttendance(req, res) {
    try {
      const { S_ID, courseCode, classId } = req.params;
      const { date, status } = req.body;
      const updatedAttendanceRecord = await attendanceService.markAttendance(S_ID, courseCode, classId, date, status);
      if (!updatedAttendanceRecord) {
        return res.status(404).json({ message: 'Attendance entry not found' });
      }
      res.status(200).json({ message: 'Attendance marked successfully', updatedAttendanceRecord });
    } catch (error) {
      res.status(500).json({ message: 'Error marking attendance', error: error.message });
    }
  }
  
  
}

module.exports = AttendanceControllers;
