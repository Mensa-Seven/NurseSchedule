const User = require("../model/User")
const Group = require("../model/Group")
const Notification = require("../model/Notification")
const jwt = require("jsonwebtoken")

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