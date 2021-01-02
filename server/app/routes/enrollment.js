const Router = require("express").Router();
const EnrollmentController = require("./../controllers").Enrollment;
const { methodNotAllowed } = require("./../functions/requests");
const { studentAuth } = require("./../middlewares/auth");

Router.get("/", EnrollmentController.list);
Router.get("/:id", EnrollmentController.retrieve);
Router.post("/", studentAuth, EnrollmentController.create);
Router.put("/:id", studentAuth, EnrollmentController.update);
Router.delete("/:id", studentAuth, EnrollmentController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;