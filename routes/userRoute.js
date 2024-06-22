const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
router.use(express.json())
const userController = require('../controllers/userController')

router.post("/",userController.createUser)
router.post("/register",userController.register)
router.post("/login",userController.login)

router.get("/",userController.getAllUser)

router.get("/select",userController.getUsersWithout)

// router.get("/:id",userController.findUsersById)
// router.put("/:id",userController.updateUsersById)

router.delete("/:id",userController.deleteUserById)

module.exports = router



