const _ = require("lodash");
const Faculty_Member = require("./../models").Faculty_Member;
const Section = require("./../models").Section;
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");
const validate = require("./../validation").Faculty_Member;
const { hashPassword, passwordValidity, generateToken } = require("./../functions/helpers");

const create = async (req, res) => {
    const {error} = validate(req.body, false, false);    
        if (error) return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            err: error.details[0].message
        });
        
        req.body.password = await hashPassword(req.body.password);
        Faculty_Member.create({
            ...req.body
        })
        .then(faculty_member => {
            res.status(statusCodes.CREATED).json({
                success: true,
                message: messages.ResourceCreated,
                data: _.pick(faculty_member, ["id", "faculty_name", "name", "phone", "email", "dob", "address", "designation"])
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
    Faculty_Member.findOne({
        where: {
            id: id
        }
    })
    .then(faculty_member => {
        if(!faculty_member) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            res.status(statusCodes.OK).json({
                success: true,
                data: faculty_member
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
    Faculty_Member.findAll().then(faculty_members => {
        res.status(statusCodes.OK).json({
            success: true,
            data: faculty_members
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
        const [updated] = await Faculty_Member.update(req.body, {
            where: { id: id }
        });
        console.log(updated);
        if (updated) {
            Faculty_Member.findOne({
                where: req.body
            })
            .then(faculty_member => {
                res.status(statusCodes.OK).json({
                    success: true,
                    message: messages.ResourceUpdated,
                    data: faculty_member
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
    Faculty_Member.findOne({
        where: {
            id: id
        }
    })
    .then(faculty_member => {  
        if(!faculty_member) {
            res.status(statusCodes.NOT_FOUND).json({
                success:true,
                message: messages.ResourceNotFound
            })
        } else {
            faculty_member.destroy()
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

    Faculty_Member
    .findOne({
        where: {email: req.body.email}
    })
    .then( async faculty_member => {
        console.log(faculty_member);
        if(!faculty_member) {
            res.status(statusCodes.NOT_FOUND).json({
                success: false, 
                message: messages.invalidEmail
            });
        }
        else {
            const validPassword = await passwordValidity(req.body.password,faculty_member.password);
            if(!validPassword) {
                res.status(statusCodes.UNAUTHORIZED).json({
                    success: false, 
                    message: messages.loginFailed
                });
            }
            else {
                const token =  generateToken(faculty_member, "faculty_member");
                res.header('x-auth-token', token).status(statusCodes.OK).json({
                    success: true, 
                    data: _.pick(faculty_member, ["id", "faculty_name", "name", "phone", "email", "dob", "address", "designation"])
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

const getFacultyMemberFromAuth = (req,res) => {
    const faculty_member = req.user;
    console.log(faculty_member.id);
    Faculty_Member
    .findByPk(faculty_member.id)
    .then(faculty_member => {
        res.status(statusCodes.OK).json({
            success: true, 
            data: faculty_member
        });
    })
    .catch(err => {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false, 
            err: err
        });
    });
}

const retrieveFacultyMemberSections = (req,res) => {
    const id = req.params.facultyMemberId;  
    // console.log(`Id = ${id}`);  
    Faculty_Member
    .findByPk(id,{
        include: [{
            model: Section,
            as: "sections"
        }]
    })
    .then(sections => {
        res.status(statusCodes.OK).json({success: true, data: sections});
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
    getFacultyMemberFromAuth,
    retrieveFacultyMemberSections
}