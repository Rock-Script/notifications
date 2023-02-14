const Joi = require('joi');
const { ObjectId } = require('../../template/tools/db-validation.tool');

module.exports.SEND_NOTIFICATION_BODY = {
    type: Joi.array().items(Joi.string().valid('email', 'sms', 'push_notification')).min(1).required(),
    email_template_id: ObjectId().optional(),
    sms_template_id: ObjectId().optional(),
    push_notification_template_id: ObjectId().optional(),
    data: Joi.any().required(),
    reciever_member_ids: Joi.array().items(ObjectId()).min(1).required()

}