const Joi = require('joi');

module.exports = (result, update) => {
    let schema = Joi.object({
        reg_no: Joi.number().required(),
        semester: Joi.string().min(3).max(20).required(),
        gpa: Joi.number().required(),
        scholistic_status: Joi.string().min(3).max(20),
    });

    if (update) {
        schema = Joi.object({
            reg_no: Joi.number(),
            semester: Joi.string().min(3).max(20),
            gpa: Joi.number(),
            scholistic_status: Joi.string().min(3).max(20),
        });
    }

    return schema.validate(result);
}