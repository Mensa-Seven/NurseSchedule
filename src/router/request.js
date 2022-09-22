const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const Request = require('../model/request.js')

const { findById, find, populate, findOne, count } = require('../model/User.js')
const router = express.Router()
const date = new Date()



router.get('/TEST', (req, res) =>{
    try{
        res.send({
            message: 'TEST'
        })

    }catch(error){
        res.send({
            message: error
        })
    }
})

router.post('/take/leave',authMiddleware, async (req, res) => {
    try{

        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        data = {
            _user: uid,
            type: req.body.type,
            detail: req.body.detail,
            _duty: req.body._duty,
            shift: req.body.shift
        }

        await Request.create({
            _user: data._user,
            type: data.type,
            detail: req.body.detail,
            _duty: data._duty,
            shift: data.shift
        })

        res.send({message: 'success'})
    }catch(error){
        res.send({
            message: 'error'
        })
    }
})

router.get('/take/leave', authMiddleware, async (req, res) => {
    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub

        const jobs = await Request.find({
            _user:uid,
            show: true,
            approve: false
        })
        if(jobs.length === 0) return res.send({
            message:'not take leave'
        })
        res.send({data: jobs})

    }catch(error){
        res.send({message: "Error"})
    }
})


module.exports = router
