'use strict';
let chalk = require('chalk')


const MAX_SIGNAL = -35
const MIN_SIGNAL = -90
const MAX_SNR = 60
const MIN_SNR = 10

// level should be a negative number
function signalLevelMarkers(level) {
  level = Math.min(MAX_SIGNAL, level)
  level = Math.max(MIN_SIGNAL, level)

  let range = Math.abs(MAX_SIGNAL - MIN_SIGNAL)
  let shiftedLevel = (-level + MAX_SIGNAL)
  let pp = (range - shiftedLevel) / range
  let p = Math.round(pp * 10)
  var q = 10 - p;
  return "|".repeat(p) + "-".repeat(q)
}

function snrMarkers(snr) {
  snr = Math.min(MAX_SNR, snr)
  snr = Math.max(MIN_SNR, snr)

  let range = Math.abs(MAX_SNR - MIN_SNR)
  let shiftedLevel = (snr - MIN_SNR)
  let pp = shiftedLevel / range
  let p = Math.round(pp * 10)
  let q = 10 - p;
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

function snrDescription(snr) {
    if (snr >= 40)
      return 'Excelent'
    else if (snr >= 25)
      return 'Good'
    else if (snr >= 15)
      return 'Low'
    else if (snr >= 10)
      return 'Very Low'

    return 'No Signal'
}

function snrColor(snr) {
    if (snr >= 40)
      return chalk.blue
    else if (snr >= 25)
      return chalk.green
    else if (snr >= 15)
      return chalk.yellow
    else if (snr >= 10)
      return chalk.red

    return chalk.red
}

//function snrStatus(snr) {
    //if (snr >= 40)
      //return 'Perfect'
    //else if (snr >= 25)
      //return 'i'
    //else if (snr >= 15)
      //return chalk.yellow
    //else if (snr >= 10)
      //return chalk.red

    //return chalk.red
//}

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
  MAX_SNR,
  MIN_SNR,
  snrMarkers,
  signalLevelDescription,
  signalLevelColor,
  signalLevelStatus,
  snrColor,
  snrDescription
}
