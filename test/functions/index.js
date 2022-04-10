// http
module.exports.testGet = async (req, res, next) => res.status(204).send()
module.exports.testPost = async (req, res, next) => res.status(204).send()
module.exports.testPut = async (req, res, next) => res.status(204).send()
module.exports.testDelete = async (req, res, next) => res.status(204).send()

// socket
module.exports.ping = () => {
    return 'pong'
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