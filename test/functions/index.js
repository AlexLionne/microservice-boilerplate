// http
module.exports.testGet = async (req, res, next) => res.status(204).send()
module.exports.testPost = async (req, res, next) => res.status(204).send()
module.exports.testPut = async (req, res, next) => res.status(204).send()
module.exports.testDelete = async (req, res, next) => res.status(204).send()

// socket
module.exports.ping = () => {
    return 'pong'
}

// basic middleware
module.exports.unAuthorized = (req, res) => {
    console.log('unAuthorized')
    return res.status(403).send()
}
module.exports.authorized = (req, res, next) => {
    console.log('authorized')
    next()
}
module.exports.testMiddlewareOK = (req, res) => {
    res.status(204).send()
}
module.exports.testMiddlewareKO = () => {
    // can't reach nasa
}
// actions
module.exports.actionsList = (req, res) => {
    res.send(req.actionManager.actions())
}

module.exports.actionTest1Seconds = () => {
    console.log('.')
}
module.exports.actionStart = (req, res) => {
    const {actionId} = req.params
    if (!actionId) return res.status(400).send()

    req.actionManager.start(actionId)

    res.status(204).send()
}
module.exports.actionStop = (req, res) => {
    const {actionId} = req.params
    if (!actionId) return res.status(400).send()

    req.actionManager.stop(actionId)

    res.status(204).send()
}

module.exports.sendPubSubEvent = async (req, res) => {
    const {eventsManager} = req
    const {topic, data} = req.body
    try {
        const messageId = await eventsManager.publish(topic, data)

        res.status(200).send(messageId)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}