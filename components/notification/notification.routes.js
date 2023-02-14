const NotificationController = require('./notification.controller');
const NotificationSchema = require('./notification.schema');
const ROUTE_METHODS = require('../../template/contants/route-methods.const');

const path = '/notification';
const routes = [
    {
        path: `${path}/send`,
        method: ROUTE_METHODS.POST,
        validation: {
        },
        handler: NotificationController.send
    }
]

module.exports = routes;