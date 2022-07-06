const express = require('express')
const Schedule = require('../model/Schedule.js')
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
        await Schedule.find({_user:pk.user_id.sub, year:date.getFullYear()})
        .populate('_user')
        .populate('_duty')
        .exec(async function(eroor, data){

            if(data[0]._user.actor === 'หัวหน้าพยาบาล'){
                
                await Group.create({
                    title:req.body.title,
                    leader:`${data[0]._user.frist_name}` + ` ${data[0]._user.last_name}`,
                    user:data[0]._user._id,
                    schedule:data[0]._duty[0]

                })
                .then(data => {
                    res.send({data:data})
                })

        }
        else{
            res.send({
                message:"ไม่สามารถสร้างกลุ่มได้ เนื่องจากคุณไม่ใช่หัวหน้า"
            })
        }
            
            
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
            title:"1234",

        })
        .populate('user')
        .populate('schedule')
        .exec(function(error ,data){
            res.send(data)
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

