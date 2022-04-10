const {BUCKET_RESOURCE_OPTIONS} = require("../../../plugins/utils/bucket");
const {Storage} = require('@google-cloud/storage');
const WORKOUTS_VOICES = 'workouts-voices'
const storage = new Storage();

const {Model} = require('objection')
const {config} = require("../config/knex");
const guid = require('objection-guid')({
    field: 'seasonWorkoutId',
});


Model.knex(config)

class SeasonWorkout extends guid(Model) {
    static get tableName() {
        return 'seasonWorkout';
    }

    static get idColumn() {
        return 'seasonWorkoutId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                seasonId: {type: 'string'},
                seasonWorkoutId: {type: 'string'},
                workoutId: {type: 'string'},
                level: {type: 'int'},
            }
        };
    }

    async $afterFind(args) {
        this.videoUrl = null

        const file = await storage
            .bucket(WORKOUTS_VOICES)
            .file(`${this.seasonWorkoutId}/announcement.mp3`)

        const [exists] = await file.exists()

        if (exists) {
            const [announcement] = await storage
                .bucket(WORKOUTS_VOICES)
                .file(`${this.seasonWorkoutId}/announcement.mp3`)
                .getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
                })

            this.announcement = announcement
        }
    }

    static get relationMappings() {
        const Workout = require('./workout');

        return {
            workout: {
                relation: Model.HasOneRelation,
                modelClass: Workout,
                join: {
                    from: 'workout.workoutId',
                    to: 'seasonWorkout.workoutId'
                }
            },
        }
    }


}

module.exports = SeasonWorkout
