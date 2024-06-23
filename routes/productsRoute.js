const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
router.use(express.json())
const productController = require('../controllers/productController')
// const auth = require('../midlware/auth')
const jwt = require("jsonwebtoken")
const User = require("../models/User")

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
        res.status(401).json({eror: "erreur"})
    }
}




router.post("/",auth,productController.createProduct)

router.get("/",productController.getAllProducts)

router.get("/select",productController.getProductsWithout)
router.get("/user/:id",productController.getProductsByUser)


router.get("/:id",productController.findProductsById)
router.put("/:id",productController.updateProductsById)

router.delete("/tok/:id",auth,productController.deleteProductsByIdWithToken)
router.delete("/:id",productController.deleteProductsById)

module.exports = router



