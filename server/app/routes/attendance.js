const Router = require("express").Router();
const AttendanceController = require("./../controllers").Attendance;
const { methodNotAllowed } = require("./../functions/requests");
const { facultyMemberAuth } = require("./../middlewares/auth");

Router.get("/", AttendanceController.list);
Router.get("/:id", AttendanceController.retrieve);
Router.post("/", facultyMemberAuth, AttendanceController.create);
Router.put("/:id", facultyMemberAuth, AttendanceController.update);
Router.delete("/:id", facultyMemberAuth, AttendanceController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;