const knex = require('knex')

const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql'

const {DB_USER, DB_PASSWORD, DB} = process.env

const connection =
    {
        host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB,
    }


console.log(connection)

const knexConfig = knex({client: 'mysql', connection})

module.exports = {
    Task: require('./task').bindKnex(knexConfig),
    WorkoutTask: require('./workoutTask').bindKnex(knexConfig),
    Workout: require('./workout').bindKnex(knexConfig),
    Finisher: require('./finisher').bindKnex(knexConfig),
    FinisherTask: require('./finisherTask').bindKnex(knexConfig),
    Level: require('./level').bindKnex(knexConfig),
    Accessory: require('./accessory').bindKnex(knexConfig),
    Awaking: require('./awaking').bindKnex(knexConfig),
    AwakingTask: require('./awakingTask').bindKnex(knexConfig),
    Skin: require('./skin').bindKnex(knexConfig),
    SkinCollection: require('./skinCollection').bindKnex(knexConfig),
}
