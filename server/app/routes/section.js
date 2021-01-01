const Router = require("express").Router();
const SectionController = require("./../controllers").Section;
const { methodNotAllowed } = require("./../functions/requests");

Router.get("/", SectionController.list);
Router.get("/:id", SectionController.retrieve);
Router.post("/", SectionController.create);
Router.put("/:id", SectionController.update);
Router.delete("/:id", SectionController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;