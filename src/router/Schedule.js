const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const {_, verifyToken} = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const { $where } = require('../model/User.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')

const router = express.Router()
const date = new Date()
 
var dutys  = []


/// ดึงข้อมูลงานทั้งหมด


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

router.patch('/update/schedule', async(req, res) => {
    
    try{

        const data = req.body.duties
        const duties = []
        data.forEach(async element => {
            duties.push(element)
        })

        await Promise.all(duties.map((duty) => Duty.updateOne({
            $and: [
                {
                    _id:duty._id
                },
                {
                    _user: duty._user
                },
                {
                    year: duty.year
                },
                {
                    month: duty.month
                },
                {
                    day: duty.day
                },
                {
                    group: duty.group
                }
            ]
        }, { $set: duty })))

        res.send({message : "Success"})

        
    }catch(error){
        res.send({error})
    }
})

//ดึงข้อมูลเวรตัวเอง ในเดือนปัจจุบัน
router.get('/me/present', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    if(!token) return res.send({
        message:"invalid Token"
    })
    try{
        const pk = verifyToken(token)
        console.log(pk);
        const duty = await Duty.find(
            {
            _user:pk.user_id.sub,
            year:date.getFullYear(),
            month:date.getMonth() +1
        })
        .populate({
            path:'_user',
            select:['frist_name', 'last_name', 'actor']
        })
        .exec(function(error, data){
            res.send({Duty:data}) 
        })
       

    }catch(error){
        res.send(error)
    }
})

router.get('/me/all/:name_group', authMiddleware, async(req, res) => {
    const {name_group} = req.body.name_group || req.params
    const token = req.query.token || req.headers['x-access-token']
    if(!token) return res.send({
        message:"invalid Token"
    })
    try{

        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        const user = await User.findById(uid)
        
        const group = await Group.findOne({_member:user._id, location:user.location, name_group:name_group})
        await ScheduleGroup.find({_group:group._id})
        .populate('_group')
        .populate('_user')
        .populate('_duty')
        .exec(async function(error, data){
            res.send({schedule:data})
        })



    }catch(error){
        res.send(error)
    }
})



/// ดึงวันที่มีกลุ่มที่เลือก ของปีเเละเดือนปัจจุบัน
router.get('/me/present/group/:id', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    if(!token) return res.send({
        message:"invalid Token"
    })
    try{
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        const duty = await Duty.find({
            _user:uid,
            year:date.getFullYear(),
            month:date.getMonth() +1,
            group:req.params.id
        })
        if(duty.length !==0){
            res.send({data:duty})
        }
        else{
            res.send({
                message:"ไม่พบกลุ่มดังกล่าว"
            })
        }
    }catch(error){
        res.send(error)
    }
})

// ในเดือนเเละปีปัจจุบัน ที่มีการขึ้นเวร
router.get('/me/present/shift', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    if(!token) return res.send({
        message:"invalid Token"
    })

    try{
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
    
        await Duty.find({
            _user:uid,
            year:date.getFullYear(),
            month:date.getMonth() + 1,
            count:{
                $gt:0
            }
        })
        .populate('_user')
        .exec(function(error, data){
           if(data.length !==0){
            res.send({
                duty:data
            })
           }else{
            res.send({
                message:"ไม่มีการขึ้นผลัด"
            })
           }
        })

    }catch(error){
        res.send({err:error})
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