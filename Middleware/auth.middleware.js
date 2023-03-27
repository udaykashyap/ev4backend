const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    let token = req.headers.authorization;

    try {

        if (token) {
            const decoded = jwt.verify(token, "Random");
            req.body.userID = decoded.userID;

            if (decoded) {
                next();
            } else {
                res.status(400).send({ msg: "Login Failed" })
            }
        } else {
            res.status(401).send({ msg: "First Login" })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}


module.exports = { auth }