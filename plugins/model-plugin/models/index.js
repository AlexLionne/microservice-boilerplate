const Knex = require("knex");
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


const knexCache = new Map();
const knex = (serviceId) => getKnexForRequest(serviceId, knexCache);


function getKnexForRequest(serviceId, knexCache) {

    let knex = knexCache.get(serviceId);

    if (!knex) {
        knex = Knex(knexConfigForTenant(serviceId));
        knexCache.set(serviceId, knex);
    }

    return knex;
}
function knexConfigForTenant(serviceId) {
    return {
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
        }};
}

module.exports = {
    Task: require('./task').bindKnex(() => knex('workout')),
    WorkoutTask: require('./workoutTask').bindKnex(() => knex('workout')),
    Workout: require('./workout').bindKnex(() => knex('workout')),
    Finisher: require('./finisher').bindKnex(() => knex('workout')),
    FinisherTask: require('./finisherTask').bindKnex(() => knex('workout')),
    Level: require('./level').bindKnex(() => knex('workout')),
    Accessory: require('./accessory').bindKnex(() => knex('workout')),
    Activation: require('./activation').bindKnex(() => knex('workout')),
    ActivationTask: require('./activationTask').bindKnex(() => knex('workout')),
    Skin: require('./skin').bindKnex(() => knex('season')),
    Season: require('./season').bindKnex(() => knex('season')),
    SkinCollection: require('./skinCollection').bindKnex(() => knex('season')),
    Auth: require('./auth').bindKnex(() => knex('auth')),
    UserData: require('./userData').bindKnex(() => knex('user')),
    User: require('./user').bindKnex(() => knex('user')),
    Token: require('./token').bindKnex(() => knex('auth')),
    FirstUser: require('./firstUser').bindKnex(() => knex('season')),
    TimeZone: require('./timezone').bindKnex(() => knex('user')),
    SeasonWorkout: require('./seasonWorkout').bindKnex(() => knex('season')),
    Reward: require('./reward').bindKnex(() => knex('season')),
    UserReward: require('./userReward').bindKnex(() => knex('user')),
    UserSeasonWorkout: require('./userSeasonWorkout').bindKnex(() => knex('user')),
    UserSkin: require('./userSkin').bindKnex(() => knex('user')),
    UserSeason: require('./userSeason').bindKnex(() => knex('user')),
    UserAvatar: require('./userAvatar').bindKnex(() => knex('user')),
    Avatar: require('./avatar').bindKnex(() => knex('user')),
    UserFeedback: require('./userFeedback').bindKnex(() => knex('user')),
    UserClub: require('./userClub').bindKnex(() => knex('user')),
    Club: require('./club').bindKnex(() => knex('club')),
}
