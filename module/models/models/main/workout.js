const {BUCKET_RESOURCE_OPTIONS} = require("../../../../plugins/utils/bucket");
const {Storage} = require('@google-cloud/storage');
const WORKOUTS_VOICES = 'workouts-voices'
const storage = new Storage();

const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class SeasonWorkout extends guid(Model) {
    static get tableName() {
        return 'main.seasonWorkout';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                workoutId: {type: 'string'},
                seasonId: {type: 'string'},
                level: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const Workout = require('./workout');

        return {
            workout: {
                relation: Model.HasOneRelation,
                modelClass: Workout,
                join: {
                    from: 'sport.workout.id',
                    to: 'main.workout.id'
                }
            },
        }
    }

    async $afterFind(args) {
        this.videoUrl = null

        const file = await storage
            .bucket(WORKOUTS_VOICES)
            .file(`${this.id}/announcement.mp3`)

        const [exists] = await file.exists()

        if (exists) {
            const [announcement] = await storage
                .bucket(WORKOUTS_VOICES)
                .file(`${this.id}/announcement.mp3`)
                .getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
                })

            this.announcement = announcement
        }
    }


}

module.exports = SeasonWorkout
