const Router = require("express").Router();
const ResultController = require("./../controllers").Result;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth } = require("./../middlewares/auth");

Router.get("/", ResultController.list);
Router.get("/:id", ResultController.retrieve);
Router.post("/", adminAuth, ResultController.create);
Router.put("/:id", adminAuth, ResultController.update);
Router.delete("/:id", adminAuth, ResultController.destroy);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;