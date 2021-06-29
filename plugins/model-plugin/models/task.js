const {BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");

const {MAX_BUCKET_TIME} = require("../../utils/bucket");
const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'taskId',
});
const {Storage} = require('@google-cloud/storage');

const TASKS_BUCKET = 'tasks-bucket'

const storage = new Storage();

class Task extends guid(Model) {
    static get tableName() {
        return 'task';
    }

    static get idColumn() {
        return 'taskId';
    }

    /**
     * Hook to handle video URL
     * @param queryContext
     * @returns {*}
     */
    async $afterFind(args) {


        this.videoUrl = null

        const file = await storage
            .bucket(TASKS_BUCKET)
            .file(`${this.taskId}/video.MOV`)

        const [exists] = await file.exists()

        if (exists) {
            const [videoUrl] = await storage
                .bucket(TASKS_BUCKET)
                .file(`${this.taskId}/video.MOV`)
                .getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
                })

            this.videoUrl = videoUrl
        }


    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                taskId: {type: 'string'},
                name: {type: 'string'},
                experience: {type: 'int'},
                level: {type: 'int'},
                bodyArea: {type: 'string'},
            }
        };
    }
}


module.exports = Task
