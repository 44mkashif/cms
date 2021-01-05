const Faculty = require("./../models").Faculty;
const Faculty_Member = require("./../models").Faculty_Member;
const Course = require("./../models").Course;
const Student = require("./../models").Student;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Faculty;
const db = require('./../models');


const create = (req, res) => {
    const {error} = validate(req.body, false);    
        if (error) return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: error.details[0].message
        });
    
        Faculty.create({
            ...req.body
        })
        .then(faculty => {
            res.status(statusCodes.CREATED).json({
                success: true,
                message: messages.ResourceCreated,
                data: faculty
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
    Faculty.findOne({
        where: {
            name: id
        }
    })
    .then(faculty => {
        if(!faculty) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: faculty
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
    Faculty.findAll().then(faculties => {
        res.status(statusCodes.OK).json({
            success: true,
            data: faculties
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
    const {error} = validate(req.body, true);    
    if (error) return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        err: error.details[0].message
    });

    const id = req.params.id;
    try {
        const [updated] = await Faculty.update(req.body, {
            where: { name: id }
        });
        console.log(updated);
        if (updated) {
            Faculty.findOne({
                where: req.body
            })
            .then(faculty => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: faculty
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
    Faculty.findOne({
        where: {
            name: id
        }
    })
    .then(faculty => {  
        if(!faculty) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            faculty.destroy()
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

const retrieveFacultyMembers = (req,res) => {
    const name = req.params.facultyId;  
    // console.log(`Id = ${id}`);  
    Faculty
    .findByPk(name,{
        include: [{
            model: Faculty_Member,
            as: "faculty_members"
        }]
    })
    .then(facultyMembers => {
        if(!facultyMembers) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({success: true, data: facultyMembers});
        }
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

const retrieveFacultyCourses = (req,res) => {
    const name = req.params.facultyId;  
    // console.log(`Id = ${id}`);  
    Faculty
    .findByPk(name,{
        include: [{
            model: Course,
            as: "courses"
        }]
    })
    .then(courses => {
        if(!courses) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({success: true, data: courses});
        }
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

const retrieveFacultyStudents = (req,res) => {
    const name = req.params.facultyId;  
    // console.log(`Id = ${id}`);  
    Faculty
    .findByPk(name,{
        include: [{
            model: Student,
            as: "students"
        }]
    })
    .then(students => {
        if(!students) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({success: true, data: students});
        }
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({success: false, err: err});
    });  
}

const retrieveFacultyDean = (req,res) => {
    const name = req.params.facultyId;  
    
    db.sequelize.query('SELECT `Faculty`.`name`, `Faculty`.`location`, `Faculty`.`dean_id`, `Faculty`.`contact_phone`, `Faculty`.`contact_email`, `Faculty`.`createdAt`, `Faculty`.`updatedAt`, `dean`.`id` AS `dean.id`, `dean`.`faculty_name` AS `dean.faculty_name`, `dean`.`name` AS `dean.name`, `dean`.`phone` AS `dean.phone`, `dean`.`email` AS `dean.email`, `dean`.`password` AS `dean.password`, `dean`.`dob` AS `dean.dob`, `dean`.`address` AS `dean.address`, `dean`.`designation` AS `dean.designation`, `dean`.`createdAt` AS `dean.createdAt`, `dean`.`updatedAt` AS `dean.updatedAt` FROM `Faculties` AS `Faculty` LEFT OUTER JOIN `Faculty_Members` AS `dean` ON `Faculty`.`dean_id` = `dean`.`id` WHERE `Faculty`.`name` = (:name)', {
        replacements: {name: name},
        type: db.sequelize.QueryTypes.SELECT,
        nest: true
    })
    .then(facultyWithDean => {
        if(facultyWithDean.length == 0) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({success: true, data: facultyWithDean});
        }
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
    retrieveFacultyMembers,
    retrieveFacultyCourses,
    retrieveFacultyStudents,
    retrieveFacultyDean
}