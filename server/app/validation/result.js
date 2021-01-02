const Joi = require('joi');

module.exports = (result, update) => {
    let schema = Joi.object({
        reg_no: Joi.number().required(),
        Semester: Joi.string().min(3).max(20).required(),
        GPA: Joi.number().required(),
        scholastic_status: Joi.string().min(3).max(20).required(),
    });

    if (update) {
        schema = Joi.object({
            reg_no: Joi.number().required(),
            Semester: Joi.string().min(3).max(20).required(),
            GPA: Joi.number().required(),
            scholastic_status: Joi.string().min(3).max(20).required(),
        });
    }

    return schema.validate(result);
}