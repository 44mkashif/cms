const Result = require("./../models").Result;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const result = require("../validation/result");
const validate = require("./../validation").Result;

const create = (req, res) => {
    const {error} = validate(req.body, false);    
        if (error) return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: error.details[0].message
        });
    
        Result.create({
            ...req.body
        })
        .then(result => {
            res.status(statusCodes.CREATED).json({
                success: true,
                message: messages.ResourceCreated,
                data: result
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
    Result.findOne({
        where: {
            id: id
        }
    })
    .then(result => {
        if(!result) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: result
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
    Result.findAll().then(result=> {
        res.status(statusCodes.OK).json({
            success: true,
            data: result
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
        const [updated] = await Result.update(req.body, {
            where: { id: id }
        });
        console.log(updated);
        if (updated) {
            Result.findOne({
                where: { id: id }
            })
            .then(result => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: result
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
    Result.findOne({
        where: {
            id: id
        }
    })
    .then(result => {  
        if(!result) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            result.destroy()
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