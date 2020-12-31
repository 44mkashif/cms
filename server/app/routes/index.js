module.exports = (app) => {
    app.use("/api/faculty", require("./faculty"))
}