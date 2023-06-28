var jwt=require('jsonwebtoken');

const JWT_SECRET = require("../config.js");

var verifyToken = (req, res, next) => {
    console.log(req)
    console.log(req.headers)
    const authHeader = req.headers.authorization;
    console.log('hereh',authHeader)
    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        res.status(401).send();
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
        if (error) {
            res.status(401).send();
            return;
        }
        req.decodedToken = decodedToken;
        next();
    });
};
module.exports = verifyToken;