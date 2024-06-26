const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require("bcrypt")
const cors = require('cors')
const jwt = require("jsonwebtoken")

exports.createUser= async(req,res)=>{
    const {name,password} = req.body

    try {
        if(!req.body.name){
            return res.status(422).json({error:'field name is required'})
        }
        if(!req.body.password){
            return res.status(422).json({error:'field password is required'})
        }
        if(!req.body.email){
            return res.status(422).json({error:'field email is required'})
        }
        
        if(await User.findOne({email:req.body.email})){
            return res.status(409).json({message: 'User${req.body.name} already exist '})
        }
        const newUser= await User.create(req.body)
        return res.status(201).json({data: newUser})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
   
  
   
}

exports.getAllUser = async(req,res)=>{
    try {
        const all_datas = await User.find()
        res.status(200).json({users:all_datas})
    } catch (error) {
        return res.status(500).json({message: error})
    }
 
}

exports.getUsersWithout = async(req,res)=>{
    try {
        const all_datas = await User.find().select('_id name email')
        res.status(200).json({all_data:all_datas})
    } catch (error) {
        return res.status(500).json({message: error})
    }

}

exports.findUsersById = async(req,res)=>{
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(422).json({message: "not a good id"})
        }
        const all_datas = await User.findById(req.params.id)
        if(!all_datas){
          return  res.status(404).json({error: "not found"})
        }
        res.status(200).json({element_received:all_datas})
    } catch (error) {
        return res.status(500).json({message: error})
    }

    
}
const createToken = (id,name,email)=>{
    return jwt.sign({userId:id,userName:name,userEmail:email},process.env.SECRET,{expiresIn:"10d"})
}
exports.register = async(req,res)=>{
    const {name,email,password} = req.body
    if(!req.body.name){
        return res.status(422).json({message:"name is required"})
    }
    if(!req.body.email){
        return res.status(422).json({message:"email is required"})
    }
    if(!req.body.password){
        return res.status(422).json({message:"password is required"})
    }

    const exist = await User.findOne({email:req.body.email})
    if(exist){
        return res.status(409).json({message: 'email already exist '})
    }
    try {
        const hash =await bcrypt.hash(req.body.password,10)
        const newUser = await User.create({name,email,password:hash})
        const token =createToken(newUser._id,newUser.name,newUser.email)
        return res.status(201).json({
            message:"user created succes",
            UserInfo: {
            name: req.body.name,
            emai: req.body.email,
            usertoken:token
        }})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

exports.login = async(req,res)=>{
    const {email,password} = req.body
    
    if(!req.body.email){
        return res.status(422).json({message:"email is required"})
    }
    if(!req.body.password){
        return res.status(422).json({message:"password is required"})
    }

    const exist = await User.findOne({email:req.body.email})
    if(!exist){
        return res.status(409).json({message: 'email or password incorrect '})
    }
    try {
        const checkPassword = await bcrypt.compare(password,exist.password)
        if(!checkPassword){
            res.json({
                message: "password incorrect"
            })
        }else{
            const token =createToken(exist._id,exist.name,exist.email)
            res.status(200).json({
                message: `connection succcess ${email}`,
                usertoken:token
            })
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

// exports.updateUsersById= async(req,res)=>{
//     if(!mongoose.isValidObjectId(req.params.id)){
//         return res.status(422).json({message: "not a good id"})
//     }
//     if(!await User.findOne({_id: req.params.id})){
//         return res.status(404).json({message: "Usernot found"})
//     }
//     try {
        
//         const all_datas = await User.findByIdAndUpdate(req.params.id, req.body,{new:true})
 
//         // if(!all_datas){
//         //   return  res.status(404).json({error: "not found"})
//         // }
//         res.status(200).json({element_received:all_datas})
//     } catch (error) {
//         return res.status(500).json({message: error.message})
//     }

// }

exports.deleteUserById= async(req,res)=>{
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(422).json({message: "not a good id"})
        }
        // if(!req.body.email){
        //     return res.status(422).json({message:"email is required"})
        // }
        if(!await User.exists({_id: req.params.id})){
            return res.status(404).json({message: "user not exist"})
        }
        const all_datas = await User.findByIdAndDelete(req.params.id)

        // if(!all_datas){
        //   return  res.status(404).json({error: "not found"})
        // }
        return res.status(201).json({element_received:"delete succes"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}
