const Joi = require('joi');

module.exports = (attendance, update) => {
    let schema = Joi.object({
        reg_no: Joi.number().required(),
        section_id: Joi.number().required(),
        lecture_no: Joi.number().required(),
        date: Joi.date().required(),
        status: Joi.boolean().required(),
    });

    if (update) {
        schema = Joi.object({
            reg_no: Joi.number(),
            section_id: Joi.number(),
            lecture_no: Joi.number(),
            date: Joi.date(),
            status: Joi.boolean(),
        });
    }

    return schema.validate(attendance);
}