const Router = require("express").Router();
const FacultyMemberController = require("./../controllers").FacultyMember;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth, facultyMemberAuth } = require("./../middlewares/auth");

Router.get("/", FacultyMemberController.list);
Router.get("/:id", FacultyMemberController.retrieve);
Router.post("/", adminAuth, FacultyMemberController.create);
Router.put("/:id", adminAuth, FacultyMemberController.update);
Router.delete("/:id", adminAuth, FacultyMemberController.destroy);

Router.post("/login", FacultyMemberController.login);
Router.get("/auth/me", facultyMemberAuth, FacultyMemberController.getFacultyMemberFromAuth);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;