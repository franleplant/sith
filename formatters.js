'use strict';
let chalk = require('chalk')



// level should be a negative number
// TODO: unit test and fine tune
const MAX_SIGNAL = -35
const MIN_SIGNAL = -90
let range = Math.abs(MAX_SIGNAL - MIN_SIGNAL)
function signalLevelMarkers(level) {
  if (level > MAX_SIGNAL) level = MAX_SIGNAL
  if (level < MIN_SIGNAL) level = MIN_SIGNAL

  let pp = (range - (-level - 30)) / range
  let p = Math.round(pp * 10)
  //let p = Math.round((100 + level + 30)/10);
  var q = 10 - p;
  return "|".repeat(p) + "-".repeat(q)
}


function signalLevelDescription(level) {
    if (level >= -50)
      return 'Excelent'
    else if (level >= -60)
      return 'Good'
    else if (level >= -70)
      return 'Fair'

    return 'Bad'
}

function signalLevelColor(level) {
    if (level >= -50)
      return chalk.blue
    else if (level >= -60)
      return chalk.green
    else if (level >= -70)
      return chalk.yellow

    return chalk.red
}

function signalLevelStatus(level) {
    if (level >= -50)
      return 'Perfect!'
    else if (level >= -60)
      return 'Every application should work correctly'
    else if (level >= -70)
      return 'You might experience some troubles with Voip and streaming'
    else if (level >= -80)
      return 'Expect difficulties to surf the web'

    return 'Expect no internet access'
}


module.exports = {
  MAX_SIGNAL,
  MIN_SIGNAL,
  signalLevelMarkers,
  signalLevelDescription,
  signalLevelColor,
  signalLevelStatus
}
