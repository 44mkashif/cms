const Joi = require('joi');

module.exports = (enrollment, update) => {
    let schema = Joi.object({
        reg_no: Joi.number().required(),
        section_id: Joi.number().required(),
        grade: Joi.string().min(1).max(2),
        academic_year: Joi.number().required(),
        date_enrolled: Joi.date(),
        semester: Joi.string().min(3).max(20).required(),
    });

    if (update) {
        schema = Joi.object({
            reg_no: Joi.number(),
            section_id: Joi.number(),
            grade: Joi.string().min(1).max(2),
            academic_year: Joi.number(),
            date_enrolled: Joi.date(),
            semester: Joi.string().min(3).max(20),
        });
    }

    return schema.validate(enrollment);
}