module.exports = `
    scalar Date
    scalar JSON

    type Query {
        bark: String
        users: [User]
        user(_id: ID!): User
        notifications: [Notification] 
    }

    type User {
        _id: ID
        frist_name: String
        last_name: String
        email: String
        actor: String
        localtion: String
        tokenVersion: Int
        createdAt: Date

        ### nested
        groups: [Group]
    }

    type Group {
        _id: ID
        location: String
        name_group: String
        _leader: String
        _member: [String]
        auto_approve: Boolean

        ### nested
        leader: User
        members: [User]
    }

    type Notification {
        _id: ID
        type: String
        fields: JSON
        approve_by: User
        createdAt: Date
        noift: String

        ### nested
        user: User
    }
`