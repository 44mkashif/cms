const Joi = require('joi');

module.exports = (section, update) => {
    let schema = Joi.object({
        course_code: Joi.string().min(3).max(20).required(),
        name: Joi.string().min(1).max(1).required(),
        faculty_member_id: Joi.number().required(),
        room_no: Joi.number().required()
    });

    if (update) {
        schema = Joi.object({
            course_code: Joi.string().min(3).max(20),
            name: Joi.string().min(1).max(1),
            faculty_member_id: Joi.number(),
            room_no: Joi.number()
        });
    }

    return schema.validate(section);
}