module.exports = (app) => {
    app.use("/api/faculty", require("./faculty")),
    app.use("/api/faculty-member", require("./faculty_member"))
}