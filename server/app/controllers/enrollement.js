const Enrollment = require("./../models").Enrollment;
const Section = require("./../models").Section;
const Course = require("./../models").Course;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Enrollment;

const create = (req, res) => {
    const {error} = validate(req.body, false);    
        if (error) return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: error.details[0].message
        });

        var date = new Date();
        date = date.toISOString().slice(0,10);
    
        Enrollment.create({
            ...req.body,
            date_enrolled: date
        })
        .then(enrollment => {
            res.status(statusCodes.CREATED).json({
                success: true,
                message: messages.ResourceCreated,
                data: enrollment
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
    Enrollment.findOne({
        where: {
            id: id
        }
    })
    .then(enrollment => {
        if(!enrollment) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: enrollment
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
    Enrollment.findAll().then(enrollments => {
        res.status(statusCodes.OK).json({
            success: true,
            data: enrollments
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
        const [updated] = await Enrollment.update(req.body, {
            where: { id: id }
        });
        console.log(updated);
        if (updated) {
            Enrollment.findOne({
                where: req.body
            })
            .then(enrollment => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: enrollment
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
    Enrollment.findOne({
        where: {
            id: id
        }
    })
    .then(enrollment => {  
        if(!enrollment) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            enrollment.destroy()
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

const retrieveEnrollmentCourse = (req,res) => {
    const eId = req.params.eId;  
    // console.log(`Id = ${id}`);  
    Enrollment
    .findByPk(eId, {
        include: [{
            model: Section,
            as: 'section',
            include: [{
                model: Course,
                as: 'course'
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
    retrieveEnrollmentCourse
}