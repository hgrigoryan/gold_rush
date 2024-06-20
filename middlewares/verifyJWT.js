const jwt = require("jsonwebtoken");
const {UnauthorizedError} = require("../utils/errors");

async function verifyJWT(req, res, next){
    try{
        // Check if cookies are sent
        if (!req.cookies?.AccessToken) {
            throw new UnauthorizedError;
        }

        const token = req.cookies.AccessToken;
        // Check if token is sent
        if(!token){
            throw new UnauthorizedError;
        }

        // Check if token is valid, will throw an error if invalid or expired
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
        req.accessToken = decodedToken;
        req.authorized = true;         

        next();
    } catch(err) {
        res.json(err);
    }
}

module.exports = verifyJWT;