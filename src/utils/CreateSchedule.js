const User = require('../model/User.js')
const Schedule = require('../model/Schedule.js')
const date = new Date()
const daysInSeptember = require('./CountDay.js')
const Duty = require('../model/Duty.js')
const Shift =require('../model/Shift.js')
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
                $push:{
                    _duty:duty._id
                }
            })

            for(let m = 0;m < daysInSeptember; m++){
                //สร้างจำนวน Entity ตามจำนวนของเดือน
                
                await Shift.create({
                    _duty:duty._id,
                    _user:uid,
                    day:m+1,
                    group:"",
                    morning:0,
                    noon:0,
                    night:0,
                    count:0
                })

                console.log("User ",uid," create shift of month", duty.month, "day ",m + 1);
            }          
          
        }
    }

    }catch(error){
        console.log("Error function CreateSchedule", error);
    }
}



module.exports = CreateSchedule