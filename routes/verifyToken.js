const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    if(authHeader){
       const token = authHeader.split(" ")[1];
       jwt.verify(token,process.env.JWT_SEC,(err,user) => {
         if(err) res.status(403).json("invalid token");

         req.user = user;
         next();
       })
    }else{
        res.status(401).json("You are not authenticated")
    }
}

module.exports = {verifyToken}