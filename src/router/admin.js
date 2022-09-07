const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const router = express.Router()
const { authMiddleware } = require("../middlewares/auth")


router.get('/TEST', (req, res) => {
    try {
        res.send({ message: "Hello World" })


    } catch (error) {
        res.send({ error: error })
    }
})
//ดึงสมาชิกในโรงพยาบาล
router.get("/member", authMiddleware, async (req, res) => {
    try{
        
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        
        const user = await User.findById(uid)
        await User.find({location:user.location})
        .then(async function(error, data){
            res.send({member:data})
        })
        
        
    }catch(error){
        res.send({message:error})
    }
})

router.post("/addUser", authMiddleware, async(req, res) => {
    //ค้นหาตาม email
    //เพิ่มเข้า
    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        const admin = await User.findById(uid)
        const member = await  User.findOne({email: req.body.email})
        if(!member) return res.send({message:"no foud"})
        member.location = admin.location
        await member.save()
        return res.send({message:"success"})
        
    }catch(error){
        res.send({message:error})
    }

})

router.patch("/updateUser/:userID", authMiddleware, async (req, res) => {
    const { body } = req.body
    const { userID } = req.params

    const res = await User.findOneAndUpdate({ _id: userID }, { $set: body })

    if (!res) return res.send("update user incomplete")

    return res.send("update user success")
})

router.delete("/deleteUser/:userID", authMiddleware, async (req, res) => {
    const { userID } = req.params

   const res =  await User.findByIdAndDelete(userID)
 if (!res) return res.send("delete user incomplete")
    return res.send("delete user success")
})

module.exports = router