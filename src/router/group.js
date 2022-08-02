const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const { findById, find, populate } = require('../model/User.js')
const router = express.Router()
const date = new Date()
const runPy = require("../utils/runPy.js")



router.get('/test', (req, res) => {
    res.send({ message: "Hello" })
})


router.patch("/create/auto/:groupId", async (req, res) => {

    const year = date.getFullYear().toString()
    const { groupId } = req.params || req.body

    if (!groupId) return res.send("Invalid group id")

    const group = await Group.findById(groupId)

    // get all member ids
    const ids = group._member.map(e => e.toString())

    // run python script
    const result = await runPy("./Heuristic-Algorithm.py", [ids])

    // map schedule with member id
    // {1: [[0, 1, 1, ....]], 2: [[1, 0, 0 ...]]}
    const resultById = result.reduce((acc, curr) => {
        // split id and schedule list -> 1:[0, 1, 1]
        const [id, data] = curr.split(":")
        // prepare empty array by member_id
        if (!acc[id]) acc[id] = []

        // converse array string to JS Array
        const arr = JSON.parse(data.replace(/\s/g, ","))
        // schedule in week -> [[0,1,1], [1,1,0], [1,1,1]]
        const subArr = []

        // loop from schedule (7 * 3 = 21 items) to 7 days
        //                        7    / 3
        for (let i = 0; i < arr.length / 3; i++) {
            // prepare empty list
            if (!subArr[i]) subArr[i] = []
            // loop each schedule
            for (let j = 0; j < 3; j++) {
                // push member schedule by day -> at [dayIndex(0-6) * 3 + eachScheduleIndex(0-3)]
                subArr[i].push(arr[i * 3 + j])
            }
        }

        // push member shedule by week
        acc[id].push(subArr)
        return acc
    }, {})

    const duties = []

    // loop create schedule from map schedule
    for (const [id, v] of Object.entries(resultById)) {
        v.forEach((week, windex) => {
            week.forEach((day, dindex) => {
                // deconstruct array via index
                const [morning, noon, night] = day
                const duty = {
                    _user: id,
                    day: windex * 7 + dindex + 1,
                    group: group.name_group,
                    morning,
                    noon,
                    night,
                    count: morning + noon + night
                }

                duties.push(duty)
            })
        })
    }

    // loop update duty filter by _user and day and year
    await Promise.all(duties.map((duty) => Duty.updateOne({
        $and: [
            {
                _user: duty._user
            },
            {
                day: duty.day
            },
            {
                year: year
            },
            {
                month:date.getMonth() + 1
            }
        ]
    }, { $set: duty })))

    res.send("Success")

})
router.get('/list/me/all', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub

    try{
        await Group.find({ _member:uid})
        .then(async function(data){
            res.send(data)
        })

    }catch(error){
        res.send(error)
    }
})

router.get('/me/member', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub

    try {

        await Group.find({ _member: uid })
            .populate([
                {
                    path: '_leader',
                    select: ['frist_name', 'last_name', 'location', 'actor', 'email']
                }
            ])
            .populate([
                {
                    path: '_member',
                    select: ['frist_name', 'last_name', 'actor', 'email']
                }
            ])
            .exec(function (error, data) {
                res.send({ group: data })
            })


    } catch (error) {
        res.send({
            error: error
        })
    }
})


/// ดึงข้อมูลตารงทั้งหมดที่เราอยู่ในกลุ่ม
router.get('/schedule/without/me', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const user = await User.findById(uid)
    const listMember = []
    const location = await User.find({location:user.location})
    location.forEach(element => listMember.push(element._id))

    try {
        await ScheduleGroup.find({
            _user:{
                $gt:uid
            },
            location:location
            
        })
        .populate('_duty')
        .populate('_user')
        .exec(function (error, data) {
            res.send({ duty: data })
        })

    } catch (error) {
        res.send(error)
    }
})

router.get('/schedule/me/all/:name_group', authMiddleware, async (req, res) => {

    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub


    try {
        const leader = await User.findById(uid)
        const group = await Group.findOne({
            _member:uid,
            location:leader.location,
            name_group:req.params.name_group || req.body.name_group
            
        })
        console.log(group._id);
        const schdule = await ScheduleGroup.find({_group:group._id})
        .populate('_duty')
        .populate('_user')
        .exec(function(error, data){
            res.send(data)
        })
            
        
    } catch (error) {
        res.send({
            error: error
        })
    }
})

router.get('/list/member/location', authMiddleware, async(req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    try{
        await User.findById(uid)
        .then(async function(data, error){
            //ใช้ค้นหา User เพื่อเอา location
        
            await User.find({
                _id:{
                    $gt:data._id
                },
                location:data.location
            })
            .then(async function(data, error){
                if(data){
                    res.send({data:data})
                }else{
                    res.send({message:"ไม่พบสมาชิก"})
                }

            })
        })
        .catch(err => {
            console.log(err);
        })

    }catch(error){
        res.send({error})
    }
})

/// ของหัวหน้าพยาบาล เพิ่มสมาชิกในโรงพยาบาลลงกลุ่มตัวเอง

router.put('/addmember', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const duties = []
    
    try{
        if(!req.body.email) return res.send({message:"ไม่ได้กำหนด email"})
        if(!req.body.name_group) return res.send({message:"ไม่ได้กำหนด name_group"})
        const leader = await User.findById(uid)
        const user = await User.findOne({email:req.body.email, location:leader.location})
        const group = await Group.findOne({name_group:req.body.name_group, location:leader.location})
        // ค้นว่าพบข้อมูล กลุ่มหรือไม่
        if(!group) return res.send({message:"ไม่พบข้อมูล"}) 
        if(!user) return res.send({message:"ไม่สามารถเพิ่มสมาชิกได้"})
        
        const findGroup = await Group.findOne({_id:group._id, _member:user._id})
        if(findGroup){
            res.send({message:"ผู้ใช้งานนี้อยู่ในหวอดอยู่เเล้ว"})
        }else{

            await Group.findOneAndUpdate({_id:group._id},
                {
                    $push:{
                        _member:user._id
                    }
                })
                .then(async() => {
                    await ScheduleGroup.create({
                        _group: group._id,
                        _user: user._id,
                    })

                    const duty = await Duty.find({
                        _user: user._id,
                        year: date.getFullYear(),
                        month: date.getMonth() +1
                    })
                    
                    await duty.forEach(async element => {
                            duties.push(element._id)
                        })
                    
                        await ScheduleGroup.updateOne({
                            $and:[
                                {
                                    _group:group._id
                                },
                                {
                                    _user:user._id
                                }
                            ]
                        }, {$push:{ _duty:duties}} )

                })

        
                res.send({message:"Success"})
        }

        

    }catch(error){
        res.send(error)
    }

})

router.delete('/me/remove', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub

    try{
        const leader = await User.findById(uid)
        const user = await User.findOne({email:req.body.email, location:leader.location})
        const group = await Group.findOne({name_group:req.body.name_group, location:leader.location})
        
       console.log(group);
       console.log(user);
       const updateGroup = await Group.findOneAndUpdate({_id:group._id, _member:user._id},
        {
            $pull:{
                _member:user._id
            }
        })
        .then(async ( ) => {
            const dutys = await Duty.find({
                _user: uid,
                year: date.getFullYear(),
                month: date.getMonth() +1 ,
                group:req.body.name_group
            })

            await Promise.all(dutys.map((duty) => Duty.updateOne({
                $and: [
                    {
                        _user: duty._user
                    },
                    {
                        day: duty.day
                    },
                    {
                        year: year
                    }
                ]
            }, { $set: duty })))
        
        })

    }catch(error){
        res.send(error)
    }

})



router.post('/create', authMiddleware, async (req, res) => {

    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const duties = []

    try {

        const duty = await Duty.find({
            _user: uid,
            year: date.getFullYear(),
            month: date.getMonth() + 1
        })


        const user = await User.findById(pk.user_id.sub)
        const location = user.location
        const actor = user.actor
        if (actor !== 'หัวหน้าพยาบาล') res.send({ message: "คุณไม่ใช่หัวหน้าพยาบาล" })
        const group = await Group.find({ location: location, name_group: req.body.name_group })
        if (group.length > 0) return res.send({
            message: "ID กลุ่มนี้ถูกสร้าเเล้ว"
        })

        await Group.create({
            name_group: req.body.name_group,
            _leader: user._id,
            _member: user._id,
            location: location
        })
            .then(async (data) => {
                await ScheduleGroup.create({
                    _group: data._id,
                    _user: user._id,
                })
                await duty.forEach(async element => {
                    duties.push(element._id)
                })
                await ScheduleGroup.updateOne({
                    $and:[
                        {
                            _group:data._id
                        },
                        {
                            _user:user._id
                        }
                    ]
                }, {$push:{ _duty:duties}} )
             

                res.send({ group: data })
            })

    } catch (error) {
        res.send({ error })
    }
})
// await Promise.all(duties.map((duty) => Duty.updateOne({
//     $and: [
//         {
//             _user: duty._user
//         },
//         {
//             day: duty.day
//         },
//         {
//             year: year
//         }
//     ]
// }, { $set: duty })))

router.get('/me', authMiddleware, async (req, res) => {

    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)

    try {
        await Group.find({
            _user: pk.user_id.sub

        })
            .populate('_user')
            .populate('_schedule')
            .exec(function (error, data) {

            })

    } catch (error) {

        res.send({ error })
    }
})

module.exports = router
