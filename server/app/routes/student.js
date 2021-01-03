const Router = require("express").Router();
const StudentController = require("./../controllers").Student;
const ResultController = require("./../controllers").Result;
const AttendanceController = require("./../controllers").Attendance;
const EnrollmentController = require("./../controllers").Enrollment;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth, studentAuth } = require("./../middlewares/auth");

Router.get("/", StudentController.list);
Router.get("/:id", StudentController.retrieve);
Router.post("/", adminAuth, StudentController.create);
Router.put("/:id", adminAuth, StudentController.update);
Router.delete("/:id", adminAuth, StudentController.destroy);

Router.post("/login", StudentController.login);
Router.get("/auth/me", studentAuth, StudentController.getStudentFromAuth);

Router.get("/:reg_no/results/", StudentController.retrieveStudentResults);
Router.get("/:reg_no/results/:id", ResultController.retrieve);
Router.post("/:reg_no/results/", ResultController.create);
Router.put("/:reg_no/results/:id", ResultController.update);
Router.delete("/:reg_no/results/:id", ResultController.destroy);

Router.get("/:reg_no/attendances/", StudentController.retrieveStudentAttendances);
Router.get("/:reg_no/attendances/:id", AttendanceController.retrieve);
Router.post("/:reg_no/attendances/", AttendanceController.create);
Router.put("/:reg_no/attendances/:id", AttendanceController.update);
Router.delete("/:reg_no/attendances/:id", AttendanceController.destroy);

Router.get("/:reg_no/enrollments/", StudentController.retrieveStudentEnrollments);
Router.get("/:reg_no/enrollments/:id", EnrollmentController.retrieve);
Router.post("/:reg_no/enrollments/", EnrollmentController.create);
Router.put("/:reg_no/enrollments/:id", EnrollmentController.update);
Router.delete("/:reg_no/enrollments/:id", EnrollmentController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;