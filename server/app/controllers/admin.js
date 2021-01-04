const _ = require("lodash");
const Admin = require("./../models").Admin;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Admin;
const { hashPassword, passwordValidity, generateToken } = require("./../functions/helpers");

const create = async (req, res) => {
    const {error} = validate(req.body, false);    
    if (error) return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        err: error.details[0].message
    });

    req.body.password = await hashPassword(req.body.password);
    Admin.create({
        ...req.body
    })
    .then(admin => {
        res.status(statusCodes.CREATED).json({
            success: true,
            message: messages.ResourceCreated,
            data: _.pick(admin, ["id", "email"])
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
    Admin.findOne({
        where: {
            id: id
        }
    })
    .then(admin => {
        if(!admin) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: admin
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
    Admin.findAll({
        attributes: { exclude: ['password'] }
    }).then(admins => {
        res.status(statusCodes.OK).json({
            success: true,
            data: admins
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
        const [updated] = await Admin.update(req.body, {
            where: { id: id }
        });
        console.log(updated);
        if (updated) {
            Admin.findOne({
                where: { id: id }
            })
            .then(admin => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: admin
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
    Admin.findOne({
        where: {
            id: id
        }
    })
    .then(admin => {  
        if(!admin) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            admin.destroy()
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
    });
}

const login = (req,res) => {
    const {error} = validate(req.body, false);
    if(error) return res.status(statusCodes.BAD_REQUEST).json({success: false, err: error.details[0].message});

    Admin
    .findOne({
        where: {email: req.body.email}
    })
    .then( async admin => {
        if(!admin) {
            res.status(statusCodes.NOT_FOUND).json({
                success: false, 
                message: messages.invalidEmail
            });
        }
        else {
            const validPassword = await passwordValidity(req.body.password,admin.password);
            console.log(validPassword);
            if(!validPassword) {
                res.status(statusCodes.UNAUTHORIZED).json({
                    success: false, 
                    message: messages.loginFailed
                });
            }
            else {
                const token =  generateToken(admin, "admin");
                res.header('x-auth-token', token).status(statusCodes.OK).json({
                    success: true, 
                    data: _.pick(admin, ["id", "email"])
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

const getAdminFromAuth = (req,res) => {
    const admin = req.user;
    console.log(admin.id);
    Admin
    .findByPk(admin.id)
    .then(admin => {
        res.status(statusCodes.OK).json({
            success: true, 
            data: admin
        });
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false, 
            err: err
        });
    });
}

module.exports = {
    create,
    retrieve,
    list,
    update,
    destroy,
    login,
    getAdminFromAuth
}