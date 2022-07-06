const User = require('./User.js')
const Schedule = require('./Schedule.js')
const mongoose = require('mongoose')

const Duty = mongoose.Schema({
    _user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },
    _schedule:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Schedule
    },
    month:{
        type:String
    },
    slots:[
    ]
})

module.exports = mongoose.model('Duty',Duty)