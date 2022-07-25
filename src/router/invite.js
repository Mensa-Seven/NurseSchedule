const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const Invite = require('../model/invite.js')
const { findById } = require('../model/User.js')
const router = express.Router()
const date = new Date()
const runPy = require("../utils/runPy.js")



router.get('/TEST', (req, res) => {
    res.send({message:"PASS"})
})

router.put('/apporve', authMiddleware, async (req, res) => {

    try{


    }catch(error){
        res.send(error)
    }

})

router.get('/invite', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    

    try{

        const invite = await Invite.find({_member:"62cd353016eaaf266706a5c1"})
        .populate('_leader')
        .populate('_group')
        .populate('_member')
        .exec(function(error, data){
            res.send({invite:data})
        })

    }catch(error){
        res.send(error)
    }

})
router.post('/invite', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const leader_id = pk.user_id.sub

    try{
        if(!req.body.email) return res.send({message:"ไม่ได้กำหนด email"})
        if(!req.body.name_group) return res.send({message:"ไม่ได้กำหนด name_group"})
        const leader = await User.findById(leader_id)
        const user = await User.findOne({email:req.body.email, location:leader.location})
        const group = await Group.findOne({name_group:req.body.name_group, location:leader.location})
        // ค้นว่าพบข้อมูล กลุ่มหรือไม่
        if(!group) return res.send({message:"ไม่พบข้อมูล"}) 
        if(!user) return res.send({message:"ไม่สามารถเพิ่มสมาชิกได้"})
        const findGroup = await Group.findOne({_id:group._id, _member:user._id})
        if(findGroup){
            res.send({message:"ผู้ใช้งานนี้อยู่ในหวอดอยู่เเล้ว"})

        }else{
            await Invite.create({
                _leader:leader._id,
                _group:group._id,
                _member:user._id
            })
            .then(function(data){
                res.send(data)
            })

        }
    }
    catch(error){
        res.send(error)
    }
})



module.exports = router

