const Mailer = require('../../template/tools/mail.tool');

module.exports.send = async(params) => {
    const mail_output = await Mailer.sendMail(params.to, params.subject, params.text, params.html);
    console.log(`mail_output: ${mail_output}`);
    return mail_output;
}