const Router = require('express').Router();
const RouteTool = require('./template/tools/route.tool');

RouteTool.setRouter(Router);
RouteTool.addRoutes(require('./components/notification/notification.routes'));

module.exports = Router;