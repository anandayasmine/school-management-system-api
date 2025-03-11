import { Router } from "express";
import {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  retrieveForNotifications
} from "../controllers/teacherController";

const router = Router();

router.post("/register", (req, res) => {
  registerStudents(req, res)
});
router.get("/commonstudents", (req, res) => { getCommonStudents(req, res) });
router.post("/suspend", (req, res) => { suspendStudent(req, res) });
router.post("/retrievefornotifications", (req, res) => { retrieveForNotifications(req, res) });

export default router;
