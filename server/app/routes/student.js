const Router = require("express").Router();
const StudentController = require("./../controllers").Student;
const { methodNotAllowed } = require("./../functions/requests");

Router.get("/", StudentController.list);
Router.get("/:id", StudentController.retrieve);
Router.post("/", StudentController.create);
Router.put("/:id", StudentController.update);
Router.delete("/:id", StudentController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;