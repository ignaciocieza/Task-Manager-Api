const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        //replace Bearer --> notas (*Authorization)
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //check si esta el id usuario y si contiene el token
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send({ erorr: "Please authenticate" });
    }
}

module.exports = auth;