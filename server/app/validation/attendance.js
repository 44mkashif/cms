const Joi = require('joi');

module.exports = (attendance, update) => {
    let schema = Joi.object({
        reg_no: Joi.number().required(),
        section_id: Joi.number().required(),
        lecture_no: Joi.number().required(),
        Date: Joi.date().required(),
        status: Joi.boolean.required(),
    });

    if (update) {
        schema = Joi.object({
            reg_no: Joi.number().required(),
            section_id: Joi.number().required(),
            lecture_no: Joi.number().required(),
            Date: Joi.date().required(),
            status: Joi.boolean.required(),
        });
    }

    return schema.validate(attendance);
}