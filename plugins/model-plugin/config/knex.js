const Knex = require('knex');

const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql'
const {DB_USER, DB_PASSWORD, DB, ENV} = process.env
const connection = ENV === "production" ?
    {
        socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB,
    }
    :
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "data",
        port: 8889, //MAMP config
    }

const config = Knex({
    client: 'mysql',
    connection,
    pool: {
        min: 1,
        max: 100,
        createTimeoutMillis: 3000,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
        propagateCreateError: false
    }
})

module.exports.config = config