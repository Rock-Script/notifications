const _ = require('lodash');
const Mailer = require('../../template/tools/mail.tool');
const ReferenceTool = require('../../template/tools/reference-tool');
const NOTIFICATION_TYPES = require('../../template/contants/notification-type');
const HTTP_RESPONSES = require('../../template/contants/http-responses');
const EmailTemplateModel = require('../email/email_template.model');

const verifyParams = async(params) => {
    if (params.type === NOTIFICATION_TYPES.EMAIL) {
        if (!params.email_template_id) {
            throw HTTP_RESPONSES.BAD_REQUEST('email_template_id is required');
        } else {
            params.email_template = await EmailTemplateModel.getEmailTemplate(params.email_template_id);
            if (!params.email_template) {
                throw HTTP_RESPONSES.NOT_FOUND('email_template', params.email_template_id);
            }
        }
    }

    if (params.reciever_member_ids) {
        params.reciever_members = await ReferenceTool.getMembers({_ids: params.reciever_member_ids });
        if (params.reciever_member_ids.length !== params.reciever_members.length) {
            throw HTTP_RESPONSES.NOT_FOUND('members', params.reciever_member_ids);
        }
    }
}

module.exports.send = async(params) => {
    params = verifyParams(params);
    const to = params.reciever_members.map(m => m.email);
    const subject = stringSubstitutions(params.email_template.subject, params.data);
    const text = stringSubstitutions(params.email_template.text, params.data);
    const html = stringSubstitutions(params.email_template.html, params.data);
    const mail_output = await Mailer.sendMail(to, subject, text, html);
    console.log(`mail_output: ${mail_output}`);
    return mail_output;
}

const stringSubstitutions = (string, map) => {
    _.keys(map).forEach(key => {
        string.replace(/{{key}}/g, map[key]);
    })
    return string;
}