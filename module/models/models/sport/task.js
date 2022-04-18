const {BUCKET_RESOURCE_OPTIONS} = require("../../../../plugins/utils/bucket");
const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'taskId',
});
const {Storage} = require('@google-cloud/storage');
const {config} = require("../../config/knex");
const TASKS_BUCKET = 'tasks-videos-bucket'
const storage = new Storage();

Model.knex(config)

class Task extends guid(Model) {
    static get tableName() {
        return 'sport.task';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                accessoryId: {type: ['string', 'null'], default: null},
                name: {type: 'string'},
                experience: {type: 'int'},
                level: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const TaskMuscle = require('./taskMuscle');
        const Accessory = require('./accessory');

        return {
            accessory: {
                relation: Model.HasOneRelation,
                modelClass: Accessory,
                join: {
                    from: 'task.accessoryId',
                    to: 'accessory.accessoryId'
                }
            },
            muscles: {
                relation: Model.HasManyRelation,
                modelClass: TaskMuscle,
                join: {
                    from: 'task.taskId',
                    to: 'taskMuscle.taskId'
                }
            },
        }
    }

    async $afterFind(args) {
        this.videoUrl = null

        const file = await storage
            .bucket(TASKS_BUCKET)
            .file(`${this.id}/video.mp4`)

        const [exists] = await file.exists()

        if (exists) {
            const [videoUrl] = await storage
                .bucket(TASKS_BUCKET)
                .file(`${this.id}/video.mp4`)
                .getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
                })

            this.videoUrl = videoUrl
        }
    }
}

module.exports = Task
