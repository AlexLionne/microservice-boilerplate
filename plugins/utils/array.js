/**
 * Remove duplicates
 * @param array
 * @param key
 * @returns {*}
 */
module.exports.uniqByKey = (array, key) => {
    let seen = {};

    return array.filter((item) => seen.hasOwnProperty(item[key]) ? false : (seen[item[key]] = true))
}
