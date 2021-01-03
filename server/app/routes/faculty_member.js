const Router = require("express").Router();
const FacultyMemberController = require("./../controllers").FacultyMember;
const SectionController = require("./../controllers").Section;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth, facultyMemberAuth } = require("./../middlewares/auth");

Router.get("/", FacultyMemberController.list);
Router.get("/:id", FacultyMemberController.retrieve);
Router.post("/", adminAuth, FacultyMemberController.create);
Router.put("/:id", adminAuth, FacultyMemberController.update);
Router.delete("/:id", adminAuth, FacultyMemberController.destroy);

Router.post("/login", FacultyMemberController.login);
Router.get("/auth/me", facultyMemberAuth, FacultyMemberController.getFacultyMemberFromAuth);

Router.get("/:facultyMemberId/sections/", FacultyMemberController.retrieveFacultyMemberSections);
Router.get("/:facultyMemberId/sections/:id", SectionController.retrieve);
Router.post("/:facultyMemberId/sections/", SectionController.create);
Router.put("/:facultyMemberId/sections/:id", SectionController.update);
Router.delete("/:facultyMemberId/sections/:id", SectionController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;