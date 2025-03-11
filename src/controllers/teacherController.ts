import connection from "../config/database";
import { RowDataPacket } from "mysql2";
import { Request, Response, NextFunction } from "express";

export const registerStudents = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { teacher, students } = req.body;

  if (!teacher || !students || !Array.isArray(students)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const [teacherRow] = await connection.promise().query<RowDataPacket[]>(
      "SELECT id FROM teachers WHERE email = ?",
      [teacher]
    );

    if (!Array.isArray(teacherRow) || teacherRow.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacherId = teacherRow[0].id;

    for (const student of students) {
      const [studentRow] = await connection.promise().query<RowDataPacket[]>(
        "SELECT id FROM students WHERE email = ?",
        [student]
      );

      if (!Array.isArray(studentRow) || studentRow.length === 0) {
        return res.status(404).json({ message: `Student ${student} not found` });
      }

      const studentId = studentRow[0].id;

      await connection.promise().query(
        "INSERT IGNORE INTO teacher_student (teacher_id, student_id) VALUES (?, ?)",
        [teacherId, studentId]
      );
    }

    return res.status(200).json({ message: "Students have been registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get common students
export const getCommonStudents = async (req: Request, res: Response) => {
  const teachers = req.query.teacher as string | string[];

  if (!teachers) {
    return res.status(400).json({ message: "Teacher email is required" });
  }

  try {
    const teachersList = Array.isArray(teachers) ? teachers : [teachers];
    const placeholders = teachersList.map(() => "?").join(",");
    
    const [result] = await connection.promise().query<RowDataPacket[]>(
      `SELECT s.email 
       FROM students s
       JOIN teacher_student ts ON s.id = ts.student_id
       JOIN teachers t ON ts.teacher_id = t.id
       WHERE t.email IN (${placeholders})
       GROUP BY s.email
       HAVING COUNT(DISTINCT t.id) = ?`,
      [...teachersList, teachersList.length]
    );

    const students = Array.isArray(result) ? result.map(row => row.email) : [];
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Suspend student
export const suspendStudent = async (req: Request, res: Response) => {
  const { student } = req.body;

  if (!student) {
    return res.status(400).json({ message: "Student email is required" });
  }

  try {
    await connection.promise().query(
      "UPDATE students SET suspended = TRUE WHERE email = ?",
      [student]
    );
    return res.status(200).json({ message: `Student ${student} has been suspended` });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Retrieve students for notifications
export const retrieveForNotifications = async (req: Request, res: Response) => {
  const { teacher, notification } = req.body;

  if (!teacher || !notification) {
    return res.status(400).json({ message: "Teacher and notification are required" });
  }

  const mentionedStudents = (notification.match(/@([\w.-]+@[\w.-]+\.\w+)/g) || []).map((s: string) => s.replace("@", ""));

  try {
    const [result] = await connection.promise().query(
      `SELECT DISTINCT s.email 
       FROM students s
       JOIN teacher_student ts ON s.id = ts.student_id
       JOIN teachers t ON ts.teacher_id = t.id
       WHERE t.email = ? AND s.suspended = FALSE
       UNION 
       SELECT email FROM students WHERE email IN (?) AND suspended = FALSE`,
      [teacher, mentionedStudents]
    );

    const recipients = Array.isArray(result) ? (result as RowDataPacket[]).map(row => row.email) : [];
    res.status(200).json({ recipients });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
