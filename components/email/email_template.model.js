const Mongo = require('../../template/tools/mongo.tool');
const DB_COLLECTION = require('../../template/contants/db-collections');

const COLLECTION_NAME = DB_COLLECTION.EMAIL_TEMPLATES;

module.exports.getEmailTemplate = async (_id) => {
    return Mongo.findOne(COLLECTION_NAME, { _id: Mongo.id(_id)});
}