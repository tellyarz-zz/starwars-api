const schema = require('../config/database');

class ClientModel {
    static client() {
        return schema.define('client', {
            id: {type:schema.Number, "null":false},
            uuid: {type:schema.String, "null":false, limit:255},
            client_name: {type:schema.String, "null":false, limit:255, unique:true},
            client_email: {type:schema.String, "null":false, limit:255, unique:true},
            api_key: {type:schema.String, "null":false, limit:255, unique:true},
            createdAt: {type:schema.Date, default:Date.now},
            updatedAt: {type:schema.Date, default:Date.now},
            deletedAt: {type:schema.Date, "null":true}
        },{
            primaryKeys: ["id"]
        });
    }
}

module.exports = ClientModel;