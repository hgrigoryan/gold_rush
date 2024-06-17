const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {UsernameInUseError, EmailInUseError, EmptyFieldsError, UsernameOrPasswdordError} = require("../utils/HttpError")


async function register(req, res){
    try{
        if(!req.body.name || !req.body.email || !req.body.password){
            throw new EmptyFieldsError;
        }
        const name = await User.findOne({name: req.body.name});
        const email = await User.findOne({email: req.body.email});
        if(name !== null){
            throw new UsernameInUseError;
        }
        if(email !== null){
            throw new EmailInUseError;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user =  new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        
        await user.save();

        const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);
        res.cookie("AccessToken", token, { httpOnly: true} ).redirect("/");

    }catch(err){
        let statusCode;
        let message;

        if(err instanceof UsernameInUseError || err instanceof EmailInUseError || err instanceof EmptyFieldsError){
            statusCode = err.statusCode;
            message = err.message;
            res.render("register.ejs", {errorMessage: message});
            return;
        }

        statusCode = "500";
        message = "Internal server error."
        res.status(statusCode).json({
            error: message
        });
    };
}

async function login(req, res){
    try{
        if(!req.body.name || !req.body.password){
            throw new EmptyFieldsError;
        }
        const user =  await User.findOne({name: req.body.name});
        // If username is in db check password
        if(user === null || !(await bcrypt.compare(req.body.password, user.password))){
            throw new UsernameOrPasswdordError;
        }

        const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);
        res.cookie("AccessToken", token, { httpOnly: true} );
        res.status("200").redirect("/");
           
    }catch(err){
        let statusCode;
        let message;

        if(err instanceof UsernameOrPasswdordError || err instanceof EmptyFieldsError){
            statusCode = err.statusCode;
            message = err.message;
            res.render("login.ejs", {errorMessage: message});
            return;
        }

        statusCode = "500";
        message = "Internal server 1error."
        res.status(statusCode).json({
            error: message
        });
    }
    
}

async function logout(req, res){
    res.cookie("AccessToken", "", { httpOnly: true} );
    res.redirect("/");
}

module.exports = {
    register,  
    login,
    logout
};