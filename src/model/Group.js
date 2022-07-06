const mongoose = require('mongoose')
const User = require('./User.js')

const Group = new mongoose.Schema({
    title:{type:String},
    leader:{type:String}
})

module.exports = mongoose.model('Group', Group)