const { Model } = require('objection')
const guid = require('objection-guid')({
  field: 'timezoneId',
});


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
