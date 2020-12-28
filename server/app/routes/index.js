module.exports = (app) => {
    app.use("/api/student", require("./student"))
}