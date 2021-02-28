module.exports = ({
  own: function (resourceType, resourceID, user, root) {

    if (!resourceType || !resourceID || !user.userID) return false

    return root !== user.profile ? getOwnerShip(resourceType, resourceID, user.userID) : true
  }
})

const {Organizer, OrganizationEvents} = require('../plugins/model-plugin/plugin')

/**
 * return Model from resourceType, resourceID, userID
 * @param resourceType
 * @param resourceID
 * @param userID
 */
function getOwnerShip(resourceType, resourceID, userID) {

  switch (resourceType) {
    case 'event' :
      return ownEvent(userID, resourceID)

  }
}


/**
 *
 * @param userID
 * @param eventID
 * @returns {Promise<boolean|*>}
 */
async function ownEvent(userID, eventID) {
  //check that event is organized by user's organization
  const organizations = await OrganizationEvents.query().where('eventID', '=', eventID)

  if (!organizations.length) return false

  //for each organization check that userID passed is included in organization

  return organizations.some(async organization =>
    await Organizer
      .query()
      .where('organizationID', '=', organization.organizationID)
      .andWhere('userID', '=', userID)
      .first() !== null
  )

}



