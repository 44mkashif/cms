const Router = require("express").Router();
const SectionController = require("./../controllers").Section;
const EnrollmentController = require("./../controllers").Enrollment;
const { methodNotAllowed } = require("./../functions/requests");
const { facultyMemberAuth } = require("./../middlewares/auth");

Router.get("/", SectionController.list);
Router.get("/:id", SectionController.retrieve);
Router.post("/", facultyMemberAuth, SectionController.create);
Router.put("/:id", facultyMemberAuth, SectionController.update);
Router.delete("/:id", facultyMemberAuth, SectionController.destroy);

Router.get("/:sectionId/enrollments/", SectionController.retrieveSectionEnrollments);
Router.get("/:sectionId/enrollments/:id", EnrollmentController.retrieve);
Router.post("/:sectionId/enrollments/", EnrollmentController.create);
Router.put("/:sectionId/enrollments/:id", EnrollmentController.update);
Router.delete("/:sectionId/enrollments/:id", EnrollmentController.destroy);

Router.get("/:sectionId/attendances/", SectionController.retrieveSectionAttendances);
Router.get("/:sectionId/attendances/:id", EnrollmentController.retrieve);
Router.post("/:sectionId/attendances/", EnrollmentController.create);
Router.put("/:sectionId/attendances/:id", EnrollmentController.update);
Router.delete("/:sectionId/attendances/:id", EnrollmentController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;