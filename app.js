const Server = require('./template/server');
const LOG_LEVEL = require('./template/contants/log-levels.const');
const LOG_TRANSPORT = require('./template/contants/log-transports.const');
const Logger = require('./template/tools/log.tool');

const server = new Server();

const init = () => {
    const config = server.initializeConfigs('.env');
    server.initializeLogger([
        server.logFactory(LOG_LEVEL.silly, LOG_TRANSPORT.CONSOLE, config.logs.all),
        server.logFactory(LOG_LEVEL.silly, LOG_TRANSPORT.FILE, config.logs.all)
    ])
    server.setPort(config.server.port);
    server.addRoutes(require('./routes'));
    server.start(() => {
        Logger.info(`Server started...`);
    });

    server.initializeMongo(config.mongo.url, config.mongo.database, () => {
        Logger.info(`Mongo initialized...`);
    });

    server.initializeMalier(config.sendinblue.api.key, config.mail.sender.email, config.mail.sender.name, () => {
        Logger.info(`Mailer initialized...`);
    })
}

init();

module.exports = server;