const mongoose = require('mongoose')
const User = require('./User.js')
const Duty = require('./Duty.js')

const Group = new mongoose.Schema({
    location:{type:String},
    name_group:{type:String},
    _leader:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    
    _member:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
})


module.exports = mongoose.model('Group', Group)