const User = require('../model/User.js')
const Schedule = require('../model/Schedule.js')
const date = new Date()
const daysInSeptember = require('./CountDay.js')
const Duty = require('../model/Duty.js')
const CreateSchedule = async(req, res, year) => {
    try{
    const user = await User.find()
    for(let i = 0; i< user.length; i++ ){
        //เช็คว่ามีข้อมูลของ ตารางของปีนี้หรือยัง
       var uid = user[i]._id
       const check =  await Schedule.findOne({
            _user:uid,
            year:year
        })
        if(check === null){
            const schedule = await Schedule.create({
                _user:uid,
                year:year
            })
            const duty = await Duty.create({
                _user:uid,
                _schedule:schedule._id,
                month:date.getMonth()
            })
            await Schedule.findByIdAndUpdate({_id:schedule._id},
                {
                    _duty:duty._id
                },
                {
                    new:true
                })
            for(let m = 0;m < daysInSeptember; m++){
               await Duty.findByIdAndUpdate({_id:duty._id}, {
                $push:{
                    slots:{
                        group:"",
                        shift1:"ว่าง",
                        shift2:"ว่าง",
                        shift3:"ว่าง",
                        count:0
                    }
                }
               })
            }          
          
        }
    }

    }catch(error){
        console.log("Error function CreateSchedule", error);
    }
}



module.exports = CreateSchedule