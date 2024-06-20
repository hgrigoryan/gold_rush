const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Error = require("../utils/errors")


async function register(req, res){
    try{
        if(!req.body.name || !req.body.email || !req.body.password || !req.body.type) {
            throw new Error.EmptyFieldsError;
        }

        if(!['fish', 'dolphin', 'whale'].includes(req.body.type)) {
            throw new Error.BadRequestError;
        }

        const name = await User.findOne({name: req.body.name});
        const email = await User.findOne({email: req.body.email});
        if(name !== null){
            throw new Error.NameInUseError;
        }
        if(email !== null){
            throw new Error.EmailInUseError;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user =  new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            type: req.body.type,
        });
        
        await user.save();

        const token = jwt.sign({ id: user.id, type: user.type }, process.env.ACCESS_TOKEN_SECRET);
        res.status("201")
        .cookie("AccessToken", token, { httpOnly: true})
        .send('User registered');

    }catch(err){
        res.json(err);
    };
}

async function login(req, res){
    try{
        if(!req.body.name || !req.body.password){
            throw new Error.EmptyFieldsError;
        }
        const user =  await User.findOne({name: req.body.name});
        // If username is in db check password
        if(user === null || !(await bcrypt.compare(req.body.password, user.password))){
            throw new Error.UsernameOrPasswdordError;
        }

        const token = jwt.sign({ id: user.id, type: user.type }, process.env.ACCESS_TOKEN_SECRET);
        res.status("200")
        .cookie("AccessToken", token, { httpOnly: true})
        .send('User loged in sccessfully');
           
    }catch(err){
        res.json(err);
    }
    
}

async function logout(req, res){
    res.status("200").cookie("AccessToken", "", { httpOnly: true});
}

module.exports = {
    register,  
    login,
    logout
};