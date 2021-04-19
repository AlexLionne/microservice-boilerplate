const knex = require('knex')
const path = require("path");

const env = require('dotenv').config({path: path.join(process.mainModule.filename, '../', '.env')})

const {DATABASE_URL, DATABASE_USER, DATABASE_PORT, DATABASE_PASSWORD, DATABASE} = env.parsed

const connection =
    {
        host: DATABASE_URL,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE,
        port: DATABASE_PORT,
    }

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
