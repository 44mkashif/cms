const Router = require("express").Router();
const AttendanceController = require("./../controllers").Attendance;
const { methodNotAllowed } = require("./../functions/requests");

Router.get("/", AttendanceController.list);
Router.get("/:id", AttendanceController.retrieve);
Router.post("/", AttendanceController.create);
Router.put("/:id", AttendanceController.update);
Router.delete("/:id", AttendanceController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;