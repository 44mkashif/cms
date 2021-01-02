const jwt = require("jsonwebtoken");
const statusCodes = require("./../constants/statusCodes");
const messages = require("./../constants/messages");

const adminAuth = (req,res,next) => {
    const token = req.header("x-auth-token");
    if(!token) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            success:false, 
            message: messages.NoAuthToken
        });
    } 
    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        if(decoded.role == 'admin'){
            req.user = decoded;
            next();
        } else {
            return res.status(statusCodes.FORBIDDEN).json({
                success:false, 
                message: messages.UnauthorizedToken
            });
        }
    }
    catch (ex) {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false, 
            message: messages.InvalidAuthToken
        });
    }
}

const facultyMemberAuth = (req,res,next) => {
    const token = req.header("x-auth-token");
    if(!token) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            success:false, 
            message: messages.NoAuthToken
        });
    } 
    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        if(decoded.role == 'faculty_member'){
            req.user = decoded;
            next();
        } else {
            return res.status(statusCodes.FORBIDDEN).json({
                success:false, 
                message: messages.UnauthorizedToken
            });
        }
    }
    catch (ex) {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false, 
            message: messages.InvalidAuthToken
        });
    }
}

const studentAuth = (req,res,next) => {
    const token = req.header("x-auth-token");
    if(!token) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            success:false, 
            message: messages.NoAuthToken
        });
    } 
    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        if(decoded.role == 'student'){
            req.user = decoded;
            next();
        } else {
            return res.status(statusCodes.FORBIDDEN).json({
                success:false, 
                message: messages.UnauthorizedToken
            });
        }
    }
    catch (ex) {
        res.status(statusCodes.BAD_REQUEST).json({
            success: false, 
            message: messages.InvalidAuthToken
        });
    }
}

module.exports = {
    adminAuth,
    facultyMemberAuth,
    studentAuth
};