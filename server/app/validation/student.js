const Joi = require('joi');

module.exports = (student, update) => {
    let schema = Joi.object({
        reg_no: Joi.number().required(),
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        dob: Joi.date().required(),
        batch: Joi.number().required(),
        address: Joi.string().required(),
        faculty_name: Joi.string().required(),
        gender: Joi.string().required(),
        cgpa: Joi.number().required(),
    });

    if (update) {
        schema = Joi.object({
            reg_no: Joi.number(),
            name: Joi.string(),
            phone: Joi.string(),
            email: Joi.string(),
            password: Joi.string(),
            dob: Joi.date(),
            batch: Joi.number(),
            address: Joi.string(),
            faculty_name: Joi.string(),
            gender: Joi.string(),
            cgpa: Joi.number(),
        });
    }

    return schema.validate(student);
}