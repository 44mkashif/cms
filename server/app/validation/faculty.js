const Joi = require('joi');
const faculty = require('../models/faculty');

module.exports = (faculty, update) => {
    let schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        location: Joi.string().min(5).max(255),
        dean_id: Joi.number(),
        contact_phone: Joi.string().min(4).max(15).required(),
        contact_email: Joi.string().min(5).max(50).required().email(),
    });

    if (update) {
        schema = Joi.object({
            name: Joi.string().min(3).max(50),
            location: Joi.string().min(5).max(255),
            dean_id: Joi.number(),
            contact_phone: Joi.string().min(4).max(15),
            contact_email: Joi.string().min(5).max(50).email(),
        });
    }

    return schema.validate(faculty);
}