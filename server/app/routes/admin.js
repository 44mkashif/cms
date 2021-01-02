const Router = require("express").Router();
const AdminController = require("./../controllers").Admin;
const { methodNotAllowed } = require("./../functions/requests");
const { adminAuth } = require("./../middlewares/auth");

Router.get("/", AdminController.list);
Router.get("/:id", AdminController.retrieve);
Router.post("/", AdminController.create);
Router.put("/:id", adminAuth, AdminController.update);
Router.delete("/:id", adminAuth, AdminController.destroy);

Router.post("/login", AdminController.login);
Router.get("/auth/me", adminAuth, AdminController.getAdminFromAuth);

Router.all('/', methodNotAllowed);
Router.all('/:id', methodNotAllowed);

module.exports = Router;