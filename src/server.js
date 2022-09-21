const express = require('express')
const cors = require('cors')
const auth = require('./router/auth.js')
const user = require('./router/user.js')
const schedule = require('./router/Schedule.js')
const group = require('./router/group.js')
const invite = require('./router/invite.js')
const ChangDuty = require('./router/changduty.js')
const admin = require('./router/admin.js')
app = express()

app.use(cors('*'))
app.use(express.json())

app.use("/api/auth", auth)
app.use("/api/me/", user)
app.use("/api/schedule", schedule)
app.use('/api/group', group)
app.use('/api/invite', invite)
app.use('/api/changduty', ChangDuty)
app.use('/api/admin', admin)



module.exports = app

