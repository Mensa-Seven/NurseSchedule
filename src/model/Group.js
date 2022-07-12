const mongoose = require('mongoose')
const User = require('./User.js')
const Duty = require('./Duty.js')

const Group = new mongoose.Schema({
    title:{type:String},
    leader:{type:String},
    user:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:User
        }
    ]
    ,
    schedule:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:Duty
    }]

})

module.exports = mongoose.model('Group', Group)