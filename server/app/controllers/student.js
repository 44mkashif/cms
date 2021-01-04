const _ = require("lodash");
const Student = require("./../models").Student;
const Result = require("./../models").Result;
const Attendance = require("./../models").Attendance;
const Enrollment = require("./../models").Enrollment;
const Section = require("./../models").Section;
const Course = require("./../models").Course;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Student;
const { hashPassword, passwordValidity, generateToken } = require("./../functions/helpers");

const create = async (req, res) => {
    const {error} = validate(req.body, false, false);    
        if (error) return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: error.details[0].message
        });
    
        req.body.password = await hashPassword(req.body.password);
        Student.create({
            ...req.body
        })
        .then(student => {
            res.status(statusCodes.CREATED).json({
                success: true,
                message: messages.ResourceCreated,
                data: _.pick(student, ["reg_no", "name", "phone", "email", "dob", "batch", "address", "faculty_name", "gender", "cgpa"])
            });
        })
        .catch((err) => {
            res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                err: err
            });
        });
}

const retrieve = (req, res) => {
    const id = req.params.id;
    Student.findOne({
        where: {
            reg_no: id
        }
    })
    .then(student => {
        if(!student) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: student
            })
        }
    })
    .catch((err) => {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: err
        });
    });
}

const list = (req, res) => {
    Student.findAll({
        attributes: { exclude: ['password'] }
    }).then(students => {
        res.status(statusCodes.OK).json({
            success: true,
            data: students
        });
    })
    .catch((err) => {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: err
        });
    });
}

const update = async (req, res) => {
    const {error} = validate(req.body, true, false);    
    if (error) return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        err: error.details[0].message
    });

    const id = req.params.id;
    try {
        const [updated] = await Student.update(req.body, {
            where: { reg_no: id }
        });
        console.log(updated);
        if (updated) {
            Student.findOne({
                where: req.body
            })
            .then(student => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: student
                })
            })
            .catch((err) => {
                res.status(statusCodes.NOT_FOUND).json({
                    success: true,
                    err: err
                });
            });
        } else {
            res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: messages.ResourceNotFound
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const destroy = (req, res) => {
    const id = req.params.id;
    Student.findOne({
        where: {
            reg_no: id
        }
    })
    .then(student => {  
        if(!student) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            student.destroy()
                .then(() => {
                    res.status(statusCodes.OK).json({
                        success: true,
                        message: messages.ResourceDestroyed
                    })
                })
                .catch((err) => {
                    res.status(statusCodes.BAD_REQUEST).json({
                        success: false,
                        err: err
                    })
                })
        }
    })
    .catch((err) => {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: err
        });
    })
}

const login = (req,res) => {
    const {error} = validate(req.body, false, true);
    if(error) return res.status(statusCodes.BAD_REQUEST).json({success: false, err: error.details[0].message});

    Student
    .findOne({
        where: {email: req.body.email}
    })
    .then( async student => {
        console.log(student);
        if(!student) {
            res.status(statusCodes.NOT_FOUND).json({
                success: false, 
                message: messages.invalidEmail
            });
        }
        else {
            const validPassword = await passwordValidity(req.body.password,student.password);
            if(!validPassword) {
                res.status(statusCodes.UNAUTHORIZED).json({
                    success: false, 
                    message: messages.loginFailed
                });
            }
            else {
                const token =  generateToken(student, "student");
                res.header('x-auth-token', token).status(statusCodes.OK).json({
                    success: true, 
                    data: _.pick(student, ["reg_no", "name", "phone", "email", "dob", "batch", "address", "faculty_name", "gender", "cgpa"])
                });
            }
        }
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false, 
            err: err
        });
    });
}

const getStudentFromAuth = (req,res) => {
    const student = req.user;
    Student
    .findByPk(student.reg_no)
    .then(student => {
        res.status(statusCodes.OK).json({
            success: true, 
            data: student
        });
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false, 
            err: err
        });
    });
}

const retrieveStudentResults = (req,res) => {
    const reg_no = req.params.reg_no;  
    // console.log(`Id = ${id}`);  
    Student
    .findByPk(reg_no,{
        include: [{
            model: Result,
            as: "results"
        }]
    })
    .then(results => {
        res.status(statusCodes.OK).json({success: true, data: results});
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

const retrieveStudentAttendances = (req,res) => {
    const reg_no = req.params.reg_no;  
    // console.log(`Id = ${id}`);  
    Student
    .findByPk(reg_no,{
        include: [{
            model: Attendance,
            as: "attendances"
        }]
    })
    .then(attendances => {
        res.status(statusCodes.OK).json({success: true, data: attendances});
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

const retrieveStudentEnrollments = (req,res) => {
    const reg_no = req.params.reg_no;  
    // console.log(`Id = ${id}`);  
    Student
    .findByPk(reg_no,{
        include: [{
            model: Enrollment,
            as: "enrollments"
        }]
    })
    .then(enrollments => {
        res.status(statusCodes.OK).json({success: true, data: enrollments});
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

const retrieveStudentSemesterEnrollments = (req,res) => {
    const reg_no = req.params.reg_no;
    const semester = req.params.semester;
    // console.log(`Id = ${id}`);  
    Student
    .findByPk(reg_no,{
        include: [{
            model: Enrollment,
            as: "enrollments",
            where: {
                semester: semester
            }
        }]
    })
    .then(enrollments => {
        res.status(statusCodes.OK).json({success: true, data: enrollments});
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

const retrieveStudentCourses = (req,res) => {
    const reg_no = req.params.reg_no;  
    // console.log(`Id = ${id}`);  
    Student
    .findByPk(reg_no, {
        include: [{
            model: Enrollment,
            as: 'enrollments',
            include: [{
                model: Section,
                as: 'section',
                include: [{
                    model: Course,
                    as: 'course'
                }]
            }]
        }]
    })
    .then(courses => {
        res.status(statusCodes.OK).json({success: true, data: courses});
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

module.exports = {
    create,
    retrieve,
    list,
    update,
    destroy,
    login,
    getStudentFromAuth,
    retrieveStudentResults,
    retrieveStudentAttendances,
    retrieveStudentEnrollments,
    retrieveStudentSemesterEnrollments,
    retrieveStudentCourses
}