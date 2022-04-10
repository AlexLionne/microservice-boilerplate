const { Model } = require('objection')
const {config} = require("../config/knex");
const guid = require('objection-guid')({
  field: 'timezoneId',
});


Model.knex(config)

class Timezone extends guid(Model) {
  static get tableName() {
    return 'timezone';
  }
  static get idColumn() {
    return 'timezoneId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        timezoneId: {type: 'string'},
        timezone: {type: 'string'},
      }
    };
  }
}

module.exports = Timezone
