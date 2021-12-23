const Knex = require('knex');

const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql'
const {DB_USER, DB_PASSWORD, DB, ENV, DB_PORT, DB_HOST, DB_SOCKET} = process.env

console.log(DB_USER, DB_PASSWORD, DB, ENV, DB_PORT, DB_HOST, DB_SOCKET)

let                 connection = {}
if (DB_SOCKET)      connection = {socketPath: DB_SOCKET}
else                connection = {host: DB_HOST}

connection = ENV === "DEV" ?
    {
        ...connection,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB,
        port: DB_PORT,
    }
    :
    {
        socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB,
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
