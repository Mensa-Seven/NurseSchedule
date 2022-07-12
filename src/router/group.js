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

/// ดึงสมาชิกใน Group 
router.get('/me/member', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub

    try{
        await Group.find({_member:uid})
        .populate([
            {
                path:'_leader',
                select:['frist_name', 'last_name', 'location', 'actor']
            }
        ])
        .populate([
            {
                path:'_member',
                select:['frist_name', 'last_name', 'actor']
            }
        ])
        .exec(function(error, data){
            res.send({group:data})
        })


    }catch(error){
        res.send({
            error:error
        })
    }
})

router.post('/create',authMiddleware,  async(req, res) => {

    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    
    try{
        const user = await User.findById(pk.user_id.sub)
        const location = user.location
        const actor = user.actor
        if(actor !== 'หัวหน้าพยาบาล') res.send({ message:"คุณไม่ใช่หัวหน้าพยาบาล"})
        const group = await Group.find({location:location})
        if(group.length !==0 ) res.send({message:"ID นี้มีการสร้างเป็น Group เเล้ว"})
        
        await Group.create({
            title:req.body.title,
            _leader:user._id,
            _member:user._id
        })
        .then(async(error, data) => {
            res.send({group:data})
        })

       
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

