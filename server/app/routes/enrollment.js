const Router = require("express").Router();
const EnrollmentController = require("./../controllers").Enrollment;
const { methodNotAllowed } = require("./../functions/requests");

Router.get("/", EnrollmentController.list);
Router.get("/:id", EnrollmentController.retrieve);
Router.post("/", EnrollmentController.create);
Router.put("/:id", EnrollmentController.update);
Router.delete("/:id", EnrollmentController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;