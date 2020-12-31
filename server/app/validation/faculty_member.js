const Joi = require('joi');

module.exports = (faculty_member, update) => {
    let schema = Joi.object({
        faculty_name: Joi.string().min(3).max(50).required(),
        name: Joi.string().min(3).max(30).required(),
        phone: Joi.string().min(4).max(15),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
        dob: Joi.date().less('now').required(),
        address: Joi.string().min(3).max(255),
        designation: Joi.string().min(2).max(45).required()
    });

    if (update) {
        schema = Joi.object({
            faculty_name: Joi.string().min(3).max(50),
            name: Joi.string().min(3).max(30),
            phone: Joi.string().min(4).max(15),
            email: Joi.string().min(5).max(50).email(),
            password: Joi.string().min(5).max(255),
            dob: Joi.date().less('now'),
            address: Joi.string().min(3).max(255),
            designation: Joi.string().min(2).max(45)
        });
    }

    return schema.validate(faculty_member);
}