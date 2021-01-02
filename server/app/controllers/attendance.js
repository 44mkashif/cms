const Attendance = require("./../models").Attendance;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Attendance;

const create = (req, res) => {
    const {error} = validate(req.body, false);    
        if (error) return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: error.details[0].message
        });
    
        Attendance.create({
            ...req.body
        })
        .then(attendance => {
            res.status(statusCodes.CREATED).json({
                success: true,
                message: messages.ResourceCreated,
                data: attendance
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
    Attendance.findOne({
        where: {
            id: id
        }
    })
    .then(attendance => {
        if(!attendance) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: attendance
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
    Attendance.findAll().then(attendances => {
        res.status(statusCodes.OK).json({
            success: true,
            data: attendances
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
        const [updated] = await Attendance.update(req.body, {
            where: { id: id }
        });
        console.log(updated);
        if (updated) {
            Attendance.findOne({
                where: { id: id }
            })
            .then(attendance => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: attendance
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
    Attendance.findOne({
        where: {
            id: id
        }
    })
    .then(attendance => {  
        if(!attendance) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            attendance.destroy()
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