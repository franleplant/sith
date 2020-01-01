let chalk = require('chalk')



// snr Status, description and Markers (levels) are calculated according to the following resources
// http://www.wireless-nets.com/resources/tutorials/define_SNR_values.html
//http://www.enterprisenetworkingplanet.com/netsp/article.php/3747656/WiFi-Define-Minimum-SNR-Values-for-Signal-Coverage.htm

exports.getPercentage = function getPercentage(value, min, max) {
  if (min == null) {
    min = 0
  }
  if (max == null) {
    max = 100
  }

  value = Math.min(max, value)
  value = Math.max(min, value)
  let range = Math.abs(max - min)

  let shiftedValue = (value - min)
  return shiftedValue / range
}

exports.getMarkers = function getMarkers(percentage) {
  let p = Math.round(percentage * 10)
  var q = 10 - p;
  return "|".repeat(p) + "-".repeat(q)
}

exports.getColor = function getColor(percentage) {
  let value = percentage * 100
  if (value >= 75)
    return chalk.blue
  else if (value >= 50)
    return chalk.green
  else if (value >= 25)
    return chalk.yellow

  return chalk.red
}

exports.dbmToQuality = function dbmToQuality(dbm) {
    dbm = Math.min(dbm, -50)
    dbm = Math.max(dbm, -100)

    return 2 * ( dbm + 100)
}
