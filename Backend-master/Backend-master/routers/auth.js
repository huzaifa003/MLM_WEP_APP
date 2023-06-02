const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const teamRouter= require('../model/Team')
const companyRouter= require('../model/Company')
router.post('/team',async(req,res)=>{
    const {username, password} = req.body;
    console.log(req.body)
    const result = await teamRouter.findOne({username: username, password: password})
    console.log(result)
    if (result == null){
        return res.status(404).json({"url" : "/login"})
    }
    if (result != null || result != {}){
        return res.status(200).json({url : "/team/"+ username})
    }
    
})

router.post('/company',async(req,res)=>{
    const {username, password} = req.body;
    const result = await companyRouter.findOne({CompName: username, CompPass: password})

    if (result == null){
        return res.status(404).json({"url" : "/login"})
    }
    console.log(result)
    if (result != null || result != {}){
        return res.status(200).json({url : "/company/"+ username})
    }
})

module.exports = router