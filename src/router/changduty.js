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
const { group } = require('console')


router.get('/TEST', (req, res) => {
    res.send({
        message:"Hello World"
    })
    console.log(ChangDuty);
})


router.get('/leader/invited', authMiddleware, async (req, res) => {
    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub

        const chagnId = req.body.chagnId


        const Duty = await ChangDuty.findOne({_id:chagnId, member_approve: false, show: true, approve: false})
        const group1 = await Group.findOne({_member:Duty.member1})
        const group2 = await Group.findOne({_member:Duty.member2})
       
        if (group1._leader[0] === group1._leader[0]){
            await Group.findOne({
                $and:[
                    {
                        _leader:uid,
                        _member:Duty.member1 || Duty.member2
                    
                    }
                ]
            })
            .then( async function(data, error){
                 await ChangDuty.findOne({_id:chagnId, member_approve: false, show: true, approve: false})
                .populate('member1')
                .populate('member2')
                .populate('_duty1')
                .populate('member_shift1')
                .populate('_duty2')
                .populate('member_shift2')
                .exec(async function(error, data){
                    res.send({data:data})
                })
            })

        }



    }catch(error){
        res.send({message:error})
    }
})




router.patch('/inproive',  authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const apporve = req.body.apporve
    const chagnId = req.body.chagnId
    console.log(apporve);
    try{
        
        if(apporve === false){
            const chang = await ChangDuty.findOneAndUpdate({_id:chagnId}
                ,{
                    member_approve: false,
                    show: false
                })
                console.log(chang);
            
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
        await ChangDuty.find({member1:uid, show:true})
        .populate('member1')
        .populate('member2')
        .populate('_duty1')
        .populate('member_shift1')
        .populate('_duty2')
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
        console.log(data[0]);
        console.log(data[1]);

      const member1 = data[0]
      const member2 = data[1]

      await ChangDuty.create({
        _group1: member1.group,
        _group2: member2.group,
        member1: member1._user,
        member2: member2._user,
        _duty1: member1._id,
        member_shift1: member1.shift,
        _duty2: member2._id,
        member_shift2: member2.shift
      }).then(async function(data){
        res.send({message:"success"})
      })

    }catch(error){
        res.send({message: error})
    }
})




module.exports = router
