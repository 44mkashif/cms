const Section = require("./../models").Section;
const Enrollment = require("./../models").Enrollment;
const Attendance = require("./../models").Attendance;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Section;

const create = (req, res) => {
    const {error} = validate(req.body, false);    
        if (error) return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: error.details[0].message
        });
    
        Section.create({
            ...req.body
        })
        .then(section => {
            res.status(statusCodes.CREATED).json({
                success: true,
                message: messages.ResourceCreated,
                data: section
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
    Section.findOne({
        where: {
            id: id
        }
    })
    .then(section => {
        if(!section) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: section
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
    Section.findAll().then(sections => {
        res.status(statusCodes.OK).json({
            success: true,
            data: sections
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
        const [updated] = await Section.update(req.body, {
            where: { id: id }
        });
        console.log(updated);
        if (updated) {
            Section.findOne({
                where: req.body
            })
            .then(section => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: section
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
    Section.findOne({
        where: {
            id: id
        }
    })
    .then(section => {  
        if(!section) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            section.destroy()
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

const retrieveSectionEnrollments = (req,res) => {
    const id = req.params.sectionId;  
    // console.log(`Id = ${id}`);  
    Section
    .findByPk(id,{
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

const retrieveSectionAttendances = (req,res) => {
    const id = req.params.sectionId;  
    // console.log(`Id = ${id}`);  
    Section
    .findByPk(id,{
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
module.exports = {
    create,
    retrieve,
    list,
    update,
    destroy,
    retrieveSectionEnrollments,
    retrieveSectionAttendances
}