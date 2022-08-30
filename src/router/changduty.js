const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const ChangDuty = require('../model/changDuty.js')
const { findById, find, populate, findOne, count, create } = require('../model/User.js')
const router = express.Router()
const date = new Date()
const runPy = require("../utils/runPy.js")
const fs = require('fs')


router.get('/TEST', (req, res) => {
    res.send({
        message:"Hello World"
    })
    console.log(ChangDuty);
})


router.patch('/inproive',  authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const apporve = req.body.apporve
    const chagnId = req.body.chagnId
    
    
    try{
        
        if(apporve === false){
            const chang = await ChangDuty.findOneAndUpdate({_id:chagnId, member_approve:false, show:true}
                ,{
                    member_approve: false,
                    show: false
                })
            
            return res.send({message:"success"})

        }else{

            await ChangDuty.updateOne({
                _id: chagnId,
                member_approve: false,
                show:true
            },{
                show:false
            })

            return res.send({message:"success"})


        }





        
        
    }catch(error){
        res.send({message:error})
    }
})



router.get('/invite', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
   
    try{
        await ChangDuty.find({member2:uid, show:true})
        .populate('member1')
        .populate('member2')
        .populate('member_shift1')
        .populate('member_shift2')
        .exec(async function(error, data){
            res.send({data:data})
        })
    }catch(error){
        res.send({message:error})
    }
})
router.post('/invite', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const data = req.body.data
    try{


      const member1 = data[0]
      const member2 = data[1]

      await ChangDuty.create({
        _group1: member1.group,
        _group2: member2.group,
        member1: member1._id,
        member2: member2._id,
        member_shift1: member1.shift,
        member_shift2: member2.shift
      }).then(async function(data){
        res.send({message:"success"})
      })

    }catch(error){
        res.send({message: error})
    }
})




module.exports = router
