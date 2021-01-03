const Router = require("express").Router();
const FacultyController = require("./../controllers").Faculty;
const FacultyMemberController = require("./../controllers").FacultyMember;
const CourseController = require("./../controllers").Course;
const StudentController = require("./../controllers").Student;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth } = require("./../middlewares/auth");

Router.get("/", FacultyController.list);
Router.get("/:id", FacultyController.retrieve);
Router.post("/", adminAuth, FacultyController.create);
Router.put("/:id", adminAuth, FacultyController.update);
Router.delete("/:id", adminAuth, FacultyController.destroy);

Router.get("/:facultyId/members/", FacultyController.retrieveFacultyMembers);
Router.get("/:facultyId/members/:id", FacultyMemberController.retrieve);
Router.post("/:facultyId/members/", FacultyMemberController.create);
Router.put("/:facultyId/members/:id", FacultyMemberController.update);
Router.delete("/:facultyId/members/:id", FacultyMemberController.destroy);

Router.get("/:facultyId/courses/", FacultyController.retrieveFacultyCourses);
Router.get("/:facultyId/courses/:id", CourseController.retrieve);
Router.post("/:facultyId/courses/", CourseController.create);
Router.put("/:facultyId/courses/:id", CourseController.update);
Router.delete("/:facultyId/courses/:id", CourseController.destroy);

Router.get("/:facultyId/students/", FacultyController.retrieveFacultyStudents);
Router.get("/:facultyId/students/:id", CourseController.retrieve);
Router.post("/:facultyId/students/", CourseController.create);
Router.put("/:facultyId/students/:id", CourseController.update);
Router.delete("/:facultyId/students/:id", CourseController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;