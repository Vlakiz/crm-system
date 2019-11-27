module.exports.overview = function(req, res) {
    res.status(200).json({
        overview: 'overview'
    })
}

module.exports.analytics = function(req, res) {
    res.status(200).json({
        analytics: 'analyrics'
    })
}