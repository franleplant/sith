

exports.dbmToQuality = function dbmToQuality(dbm) {
    dbm = Math.min(dbm, -50)
    dbm = Math.max(dbm, -100)

    return 2 * ( dbm + 100)
}
