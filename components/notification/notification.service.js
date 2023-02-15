const _ = require('lodash');
const Mailer = require('../../template/tools/mail.tool');
const ReferenceTool = require('../../template/tools/reference-tool');
const NOTIFICATION_TYPES = require('../../template/contants/notification-type');
const HTTP_RESPONSES = require('../../template/contants/http-responses');
const EmailTemplateModel = require('../email/email_template.model');

const verifyParams = async(params) => {
    if (params.type.indexOf(NOTIFICATION_TYPES.EMAIL) > -1) {
        if (!params.email_template_id) {
            throw HTTP_RESPONSES.BAD_REQUEST('email_template_id is required');
        } else {
            params.email_template = await EmailTemplateModel.getEmailTemplate(params.email_template_id);
            if (!params.email_template) {
                throw HTTP_RESPONSES.NOT_FOUND('email_template', params.email_template_id);
            }
        }
    }

    if (params.reciever_ids) {
        const member_ids = [], user_ids = [];
        params.reciever_ids.forEach(m => {
            if (m.type === 'member') member_ids.push(m._id);
            if (m.type === 'user') user_ids.push(m._id);
        })
        params.reciever_members = await ReferenceTool.getMembers({_ids: member_ids });
        if (member_ids.length !== params.reciever_members.length) {
            throw HTTP_RESPONSES.NOT_FOUND('members', member_ids);
        }

        params.reciever_users = await ReferenceTool.getUsers({_ids: user_ids });
        if (user_ids.length !== params.reciever_users.length) {
            throw HTTP_RESPONSES.NOT_FOUND('users', user_ids);
        }
    }

    return params;
}

module.exports.send = async(params) => {
    params = await verifyParams(params);
    const to = [...(params.reciever_members || []), ...(params.reciever_users || [])].map(m => m.email);
    const subject = stringSubstitutions(params.email_template.subject, params.data);
    const text = stringSubstitutions(params.email_template.text, params.data);
    const html = stringSubstitutions(params.email_template.html, params.data);

    const mail_output = [];
    for (let t of to) {
        mail_output.push(await Mailer.sendMail(t, subject, text, html));
    }
    console.log(`mail_output: ${JSON.stringify(mail_output)}`);
    return mail_output;
}

const stringSubstitutions = (string, map) => {
    _.keys(map).forEach(key => {
        string = string.replaceAll(`{{${key}}}`, map[key]);
    })
    return string;
}