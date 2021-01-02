const Router = require("express").Router();
const FacultyController = require("./../controllers").Faculty;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth } = require("./../middlewares/auth");

Router.get("/", FacultyController.list);
Router.get("/:id", FacultyController.retrieve);
Router.post("/", adminAuth, FacultyController.create);
Router.put("/:id", adminAuth, FacultyController.update);
Router.delete("/:id", adminAuth, FacultyController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;