module.exports = (app) => {
    app.use("/api/faculty", require("./faculty")),
    app.use("/api/faculty-member", require("./faculty_member")),
    app.use("/api/course", require("./course")),
    app.use("/api/section", require("./section"))
}