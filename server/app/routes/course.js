const Router = require("express").Router();
const CourseController = require("./../controllers").Course;
const SectionController = require("./../controllers").Section;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth } = require("./../middlewares/auth");

Router.get("/", CourseController.list);
Router.get("/:id", CourseController.retrieve);
Router.post("/", adminAuth, CourseController.create);
Router.put("/:id", adminAuth, CourseController.update);
Router.delete("/:id", adminAuth, CourseController.destroy);

Router.get("/:course_code/sections/", CourseController.retrieveCourseSections);
Router.get("/:course_code/sections/:id", SectionController.retrieve);
Router.post("/:course_code/sections/", SectionController.create);
Router.put("/:course_code/sections/:id", SectionController.update);
Router.delete("/:course_code/sections/:id", SectionController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;