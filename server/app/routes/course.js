const Router = require("express").Router();
const CourseController = require("./../controllers").Course;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth } = require("./../middlewares/auth");

Router.get("/", CourseController.list);
Router.get("/:id", CourseController.retrieve);
Router.post("/", adminAuth, CourseController.create);
Router.put("/:id", adminAuth, CourseController.update);
Router.delete("/:id", adminAuth, CourseController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;