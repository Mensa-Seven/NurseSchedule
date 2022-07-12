const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const {_, verifyToken} = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const router = express.Router()
const date = new Date()
 


router.get('/test', (req,res) => {
    res.send({message:"Hello"})
})

router.post('/create',authMiddleware,  async(req, res) => {

    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    
    try{
        const user = await User.findById(pk.user_id.sub)
        const location = user.location
        const actor = user.actor
        
       
    }catch( error ){
        res.send({error})
    }
})

router.get('/me', authMiddleware, async(req, res) => {
   
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    
    try{
        await Group.find({
            _user:pk.user_id.sub

        })
        .populate('_user')
        .populate('_schedule')
        .exec(function(error ,data){
            
        })

    }catch(error ){

        res.send({error})
    }
})



router.put('addmember', authMiddleware, async(req, res) => {
    
    try{
        





    }catch( error){
        res.send(error)
    }



})

module.exports = router

