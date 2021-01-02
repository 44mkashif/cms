const Joi = require('joi');

module.exports = (faculty_member, update) => {
    let schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    if (update) {
        schema = Joi.object({
            email: Joi.string().min(5).max(50).email(),
            password: Joi.string().min(5).max(255),
        });
    }

    return schema.validate(faculty_member);
}