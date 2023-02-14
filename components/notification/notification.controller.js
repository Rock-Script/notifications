const NotificationService = require('./notification.service');

module.exports.send = async (req, res, next) => {
    const data = await NotificationService.send(req.body);
    return {
        status: 200,
        data,
        message: 'Successfully recieved notification request'
    }
}
