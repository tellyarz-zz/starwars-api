const schema = require('../config/database');

class CommentModel {
    static comment() {
        return schema.define('comment', {
            id: {type:schema.Number, "null":false},
            uuid: {type:schema.String, "null":false, limit:255},
            movie_id: {type:schema.Number, "null":false, limit:6},
            ip: {type:schema.String, "null":false, limit:255},
            message: {type:schema.Text, "null":false, limit:500},
            createdAt: {type:schema.Date, default:Date.now}
        },{
            primaryKeys: ["id"]
        });
    }
}

module.exports = CommentModel;