const express = require('express')
const Schedule = require('../model/Schedule.js')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const {_, verifyToken} = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const router = express.Router()
const date = new Date()
 

/// ดึงข้อมูลงานทั้งหมด
router.get('/all', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)

    if(!token) return res.send({
        message:"invalid Token"
    })

    try{

        await Duty.find()
        .then(data => {
            res.send({data})
        })
        

    }catch( error ){
        res.send({error})
    }
})

// สร้างตารางของเเต่ละคน จะสร้างจากเดือนปัจจุบัน
router.post('/create', async (req, res) => {
   try{
    const schedule = await CreateSchedule(req, res, date.getFullYear())

    res.send({
        message:"Success",
        data:schedule
    })

   }catch( error ){
    res.status(500)
    .json({
        message:error
    })
   }
   
})


router.get('/me/present', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    if(!token) return res.send({
        message:"invalid Token"
    })
    try{
        const pk = verifyToken(token)
        await Duty.findOne({_user:pk.user_id.sub, month:date.getMonth()})
        .populate({
            path:"_user",
            select:['frist_name', 'last_name','actor']
        })
        .populate({
            path:"_schedule",
            select:'year'
        })
        .exec(function(error, data){
            res.send({
                duty:data
            })
        })
     

    }catch(error){
        res.send(error)
    }
})

// ดึงขึ้นมูล ตารางทั้งหมดที่มีของตัวเอง
router.get('/me/all',authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    if(!token) return res.send({
        message:"invalid Token"
    })

    try{
        
        const pk = verifyToken(token)

        await Duty.find({_user:pk.user_id.sub})
        .populate('_user')
        .populate('_schedule')
        .exec(function(error, data){
            res.send({
                data:data
            })
        })
        

    }catch(error){

    }
})

/// ดึงข้อมูลตารางข้อง user เฉพราะกลุ่ม ตาม id เเละเดือน
router.get('/me/month', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    if(!token) return res.send({
        message:"invalidit Token"
    })
    try{

        const pk = verifyToken(token)
        const user = await User.findById(pk.user_id.sub)
        await Schedule.findOne({
            _id:"62b2b472076f088df2bff7bd",
            _user:user._id
        })
        .populate('_user')
        .exec(function(error, data){
           
        })


    }catch(error){
        res.send(
            error
        )
    }

})
module.exports = router