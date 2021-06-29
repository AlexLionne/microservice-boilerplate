const knex = require("knex");
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
    Season: require('./season').bindKnex(knexConfig),
    SkinCollection: require('./skinCollection').bindKnex(knexConfig),
    Auth: require('./auth').bindKnex(knexConfig),
    UserData: require('./userData').bindKnex(knexConfig),
    User: require('./user').bindKnex(knexConfig),
    Token: require('./token').bindKnex(knexConfig),
    FirstUser: require('./firstUser').bindKnex(knexConfig),
    TimeZone: require('./timezone').bindKnex(knexConfig),
    SeasonWorkout: require('./seasonWorkout').bindKnex(knexConfig),
    UserSeasonWorkout: require('./userSeasonWorkout').bindKnex(knexConfig),
    UserSkin: require('./userSkin').bindKnex(knexConfig),
    SeasonWorkoutReward: require('./seasonWorkoutReward').bindKnex(knexConfig),
    UserSeason: require('./userSeason').bindKnex(knexConfig),
    UserAvatar: require('./userAvatar').bindKnex(knexConfig),
    Avatar: require('./avatar').bindKnex(knexConfig),
}
