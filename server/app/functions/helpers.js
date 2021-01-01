const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

const passwordValidity =  async (passwordEntered, validPassword) => {
    return await bcrypt.compare(passwordEntered, validPassword);
}

module.exports = {
    hashPassword,
    passwordValidity
}