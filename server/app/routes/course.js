const Router = require("express").Router();
const CourseController = require("./../controllers").Course;
const { methodNotAllowed } = require("./../functions/requests");

Router.get("/", CourseController.list);
Router.get("/:id", CourseController.retrieve);
Router.post("/", CourseController.create);
Router.put("/:id", CourseController.update);
Router.delete("/:id", CourseController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;