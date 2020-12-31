const statusCodes = require("./../constants/statusCodes");

const methodNotAllowed = (req, res) => {
    res.status(statusCodes.METHOD_NOT_ALLOWED).send({
        success: false,
        message: 'Method Not Allowed',
    });
};

module.exports = {
    methodNotAllowed
}