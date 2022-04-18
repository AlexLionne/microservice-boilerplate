module.exports = {

    // sport
    Muscle: require('./sport/muscle'),
    TaskMuscle: require('./sport/taskMuscle'),
    Task: require('./sport/task'),
    WorkoutTask: require('./sport/workoutTask'),
    Workout: require('./sport/workout'),
    Finisher: require('./sport/finisher'),
    FinisherTask: require('./sport/finisherTask'),
    Accessory: require('./sport/accessory'),
    Activation: require('./sport/activation'),
    ActivationTask: require('./sport/activationTask'),

    // user
    Information: require('./user/information'),
    UserReward: require('./user/reward'),
    UserSeasonWorkout: require('./user/workout'),
    UserSkin: require('./user/skin'),
    UserSeason: require('./user/season'),
    UserAvatar: require('./user/avatar'),
    UserAvatarElement: require('./user/element'),
    UserFeedback: require('./user/feedback'),
    UserClub: require('./user/club'),
    Device: require('./user/device'),

    // main
    Club: require('./main/club'),
    User: require('./main/user'),
    Level: require('./main/level'),
    Season: require('./main/season'),
    SeasonWorkout: require('./main/workout'),
    Auth: require('./main/auth'),
    Token: require('./main/token'),
    FirstUser: require('./main/firstUser'),
    Reward: require('./main/reward'),
    Avatar: require('./main/avatar'),
    AvatarSkin: require('./main/skin'),
    AvatarElementEditable: require('./main/editable'),
    AvatarElement: require('./main/element'),
    Skin: require('./main/skin'),
    SkinCollection: require('./main/collection'),

    // events

    Event: require('./events/event'),
    // shop
    Transaction: require('./shop/transaction'),
}
