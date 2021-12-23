const Knex = require('knex');

const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql'
const {DB_USER, DB_PASSWORD, DB, ENV, DB_PORT, DB_HOST, DB_SOCKET} = process.env

if (ENV === "DEV") console.log(DB_USER, DB_PASSWORD, DB, ENV, DB_PORT, DB_HOST, DB_SOCKET)

let connection = {}
if (DB_SOCKET) connection = {socketPath: DB_SOCKET}
else connection = {host: DB_HOST}

connection = ENV === "DEV" ?
    {
        ...connection,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB,
        charset: 'utf8'
    }
    :
    {
        socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB,
        charset: 'utf8'
    }


const config = Knex({
    client: 'mysql2',
    connection,
    debug: ENV === "DEV",
    pool: {
        min: 1,
        max: 100,
        createTimeoutMillis: 3000,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
        propagateCreateError: false,
        /* afterCreate: (conn, done) => {
            // .... add logic here ....
            // you must call with new connection
            console.log('new connection created')
            done(null, conn);
        },*/
    }
})

module.exports.config = config
