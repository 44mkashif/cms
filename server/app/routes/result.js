const Router = require("express").Router();
const ResultController = require("./../controllers").Result;
const { methodNotAllowed } = require("./../functions/requests");

Router.get("/", ResultController.list);
Router.get("/:id", ResultController.retrieve);
Router.post("/", ResultController.create);
Router.put("/:id", ResultController.update);
Router.delete("/:id", ResultController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;