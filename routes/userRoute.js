const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require("jsonwebtoken")
router.use(express.json())
const userController = require('../controllers/userController')

const auth = async(req,res,next)=>{
    const {authorization} = req.headers

    if(!authorization){
        return res.status(401).json({errors: "token not exist"})
    }
    const token = authorization.split(" ")[1]
    try {
        const {id}= jwt.verify(token, process.env.SECRET)
        // req.user = await User.findById(id).select("_id")
        // next()
        const decode= jwt.verify(token, process.env.SECRET)
        req.user = decode
        // req.user = {decode}
        next()

    } catch (error) {
        res.status(401).json({eror: error.message})
    }
}



router.post("/",userController.createUser)
router.post("/register",userController.register)
router.post("/login",userController.login)

router.get("/",userController.getAllUser)

router.get("/select",userController.getUsersWithout)

// router.get("/:id",userController.findUsersById)
// router.put("/:id",userController.updateUsersById)

router.delete("/:id",auth,userController.deleteUserById)

module.exports = router



