const Joi = require('joi');

module.exports = (student, update) => {
    let schema = Joi.object({
        reg_no: Joi.number().required(),
        name: Joi.string().min(3).max(30).required(),
        phone: Joi.string().min(4).max(15),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
        dob: Joi.date().less('now').required(),
        batch: Joi.number().required(),
        address: Joi.string().min(3).max(255),
        faculty_name: Joi.string().min(3).max(50).required(),
        gender: Joi.string().min(1).max(1),
        cgpa: Joi.number(),
    });

    if (update) {
        schema = Joi.object({
            reg_no: Joi.number(),
            name: Joi.string().min(3).max(30),
            phone: Joi.string().min(4).max(15),
            email: Joi.string().min(5).max(50).email(),
            password: Joi.string().min(5).max(255),
            dob: Joi.date().less('now'),
            batch: Joi.number(),
            address: Joi.string().min(3).max(255),
            faculty_name: Joi.string().min(3).max(50),
            gender: Joi.string().min(1).max(1),
            cgpa: Joi.number(),
        });
    }

    return schema.validate(student);
}