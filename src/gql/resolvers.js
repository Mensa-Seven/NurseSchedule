const User = require("../model/User")
const Group = require("../model/Group")
const Notification = require("../model/Notification")
const { default: mongoose } = require("mongoose")


module.exports = {
    Query: {
        bark: () => "BARK",
        users: async () => await User.find(),
        user: async (root, { _id }) => await User.findById(_id),
        notifications: async (root, _, { decoded }) => {

            const noti = await Notification.find({
                _user: decoded.user_id.sub
            })

            return noti
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
        leader: async (root) => await User.findById(root._leader)
    },
    Notification: {
        approve_by: async (root) => await User.findById(root.approve_by),
        user: async (root) => await User.findById(root._user),
    }
}