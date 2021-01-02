module.exports = (app) => {
    app.use("/api/faculty", require("./faculty")),
    app.use("/api/faculty-member", require("./faculty_member")),
    app.use("/api/course", require("./course")),
    app.use("/api/student", require("./student")),
    app.use("/api/enrollment", require("./enrollment")),
    app.use("/api/section", require("./section")),
    app.use("/api/result", require("./result")),
    app.use("/api/attendance", require("./attendance"))
}