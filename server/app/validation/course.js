const Joi = require('joi');

module.exports = (course, update) => {
    let schema = Joi.object({
        course_code: Joi.string().min(3).max(20).required(),
        faculty_name: Joi.string().min(3).max(50).required(),
        name: Joi.string().min(3).max(50).required(),
        credit_hours: Joi.number().required(),
        description: Joi.string().required(),
    });

    if (update) {
        schema = Joi.object({
            course_code: Joi.string().min(3).max(20),
            faculty_name: Joi.string().min(3).max(50),
            name: Joi.string().min(3).max(50),
            credit_hours: Joi.number(),
            description: Joi.string(),
        });
    }

    return schema.validate(course);
}