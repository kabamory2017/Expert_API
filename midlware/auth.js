const jwt = require("jsonwebtoken")
const User = require("../models/User")


exports.auth = async(req,res,next)=>{
    const {authorization} = req.headers

    if(!authorization){
        return res.status(401).json({errors: "token not exist"})
    }
    const token = authorization.split(" ")[1]
    try {
        const decode= jwt.verify(token, process.env.SECRET)
        req.user = decode
        // req.user = {decode}
        next()

    } catch (error) {
        res.status(401).json({eror: "erreur"})
    }
}


