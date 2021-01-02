const Router = require("express").Router();
const SectionController = require("./../controllers").Section;
const { methodNotAllowed } = require("./../functions/requests");
const { facultyMemberAuth } = require("./../middlewares/auth");

Router.get("/", SectionController.list);
Router.get("/:id", SectionController.retrieve);
Router.post("/", facultyMemberAuth, SectionController.create);
Router.put("/:id", facultyMemberAuth, SectionController.update);
Router.delete("/:id", facultyMemberAuth, SectionController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;