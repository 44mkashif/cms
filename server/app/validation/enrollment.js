const Joi = require('joi');

module.exports = (enrollment, update) => {
    let schema = Joi.object({
        id: Joi.string().min(3).max(20).required(),
        reg_no: Joi.number().required(),
        section_id: Joi.number().required(),
        grade: Joi.string().required(),
        academic_year: Joi.number().required(),
        date_enrolled: Joi.date().required(),
        semester: Joi.string().required(),
    });

    if (update) {
        schema = Joi.object({
            id: Joi.string().min(3).max(20),
            reg_no: Joi.number(),
            section_id: Joi.number(),
            grade: Joi.string(),
            academic_year: Joi.number(),
            date_enrolled: Joi.date(),
            semester: Joi.string(),
        });
    }

    return schema.validate(enrollment);
}