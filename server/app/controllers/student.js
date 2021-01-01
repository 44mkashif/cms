const _ = require("lodash");
const Student = require("./../models").Student;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Student;
const { hashPassword } = require("./../functions/helpers");

const create = async (req, res) => {
    const {error} = validate(req.body, false);    
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
    Student.findAll().then(students => {
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
    const {error} = validate(req.body, true);    
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

module.exports = {
    create,
    retrieve,
    list,
    update,
    destroy
}