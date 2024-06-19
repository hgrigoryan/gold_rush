const jwt = require("jsonwebtoken");
const {UnauthorizedError} = require("../utils/errors");

function verifyJWT(req, res, next){
    try{
        const token = req.cookies.AccessToken;
        // Check if token is sent
        if(!token){
            throw new UnauthorizedError;
        }

        // Check if token is valid
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userType) => {
            if(err){
                throw new UnauthorizedError;
            }else{
                req.accessToken = token;
                req.authorized = true;
            }

        }); 

        next();
    }catch(err){
        let statusCode = "500";
        let message = "Internal server error."
        if(err instanceof UnauthorizedError){
            statusCode = err.statusCode;
            message = err.message;
            res.render("login.ejs", {errorMessage: message});
            return;
        }
        res.status(statusCode).json({
            error: message
        });
    }
}

module.exports = verifyJWT;