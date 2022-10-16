const User = require("../model/User")
const Group = require("../model/Group")
const Notification = require("../model/Notification")
const jwt = require("jsonwebtoken")
const Duty = require("../model/Duty")

function requiredAuth({ authorization }) {
    return jwt.verify(authorization, process.env.JWT_SECRET)
}

module.exports = {
    Query: {
        bark: () => "BARK",
        users: async () => await User.find(),
        user: async (root, { _id }) => await User.findById(_id),
        notifications: async (root, { filter }, { decoded }) => {

            console.log(filter)

            const noti = await Notification.find({
                _user: decoded.user_id.sub
            }).where(filter)

            return noti
        }
    },
    Mutation: {
        deleteGroup: async (_, { input }, ctx) => {
            const decoded = requiredAuth(ctx)
            console.log(decoded)
            const user = await User.findById(decoded.user_id.sub)
            const group = await Group.findById(input.groupId)

            const noti = {
                type: "DELETE_GROUP",
                _user: user._id,
                fields: {
                    location: user.location,
                    group
                }
            }

            await Notification.create(noti)
            console.log(noti)
            return "OK"
        },
        approveDeleteGroup: async (_, { input }, ctx) => {
            const decoded = requiredAuth(ctx)
            const noti = await Notification.findById(input.notificationId)
            const groupId = noti.fields.group._id

            await Group.updateOne({ _id: groupId }, { $set: { deleted: true } })
            await Notification.updateOne({ _id: input.notificationId }, { $set: { approve_by: decoded.user_id.sub } })
        },
        updateGroup: async (_, { input }) => {
            const { _id, ...body } = input
            const group = await Group.findById(_id)

            if (input.limit !== undefined && group._member.length > input.limit) {
                throw new Error("member less limit")
            }
            await Group.updateOne({ _id }, { $set: body })

            return await Group.findById(_id)
        },
        createLeave: async (_, { input }, context) => {
            const decoded = requiredAuth(context)
            const { memberIds, dutyId, shift } = input
            const duty = await Duty.findById(dutyId)
            const group = await Group.findOne(duty.name_group)

            const response = await Promise.all(memberIds.map(id => Notification.create({
                type: "LEAVE_DUTY",
                _user: id,
                fields: {
                    createdBy: decoded.user_id.sub,
                    dutyId: dutyId,
                    shift: shift,
                    approve: false,
                    leader: group._leader[0].toString()
                }
            })))

            return response
        },
        approveLeaveMember: async (_, { input }, context) => {
            const decoded = requiredAuth(context)

            const { notificationId, approve } = input
            const noti = await Notification.findById(notificationId).lean()

            const data = { ...noti, approve_by: decoded.user_id.sub, }
            data.fields.approve = approve

            const response = await Notification.updateOne({ _id: notificationId }, { $set: data })
            return response
        },
        approveLeaveLeader: async (_, { input }, context) => {
            const decoded = requiredAuth(context)

            const { notificationId, approve } = input
            const noti = await Notification.findById(notificationId).lean()
            noti.noift = "2"

            const { dutyId, shift, createdBy } = noti.fields


            const duty = await Duty.findById(dutyId).lean()
            console.log(noti.fields)
            console.log(duty)

            // console.log(duty, noti.fields)
            const group = await Group.findOne({name_group: duty.group})

            const newDuty = JSON.parse(JSON.stringify(duty))

            Object.keys(shift).forEach(key => {
                newDuty[key] = 0
            })

            const changeNoti = {
                type: "CHANGE_DUTY",
                _user: createdBy,
                approve_by: decoded.user_id.sub,
                fields: {
                    prev: duty,
                    duty: newDuty,
                    group: group
                }
            }
            return await Notification.create(changeNoti)
        }
    },
    User: {
        groups: async (root) => {
            const groups = await Group.find({
                _member: {
                    $in: [root._id]
                }
            })

            return groups
        }
    },
    Group: {
        leader: async (root) => await User.findById(root._leader),
        members: async (root) => {
            return await Promise.all(root._member.map(m => User.findById(m)))
        }
    },
    Notification: {
        approve_by: async (root) => await User.findById(root.approve_by),
        user: async (root) => await User.findById(root._user),
    },


}