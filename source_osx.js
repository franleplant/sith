'use strict';
let execSync = require('child_process').execSync
let utils = require('./utils')


function get_data_osx() {
  let res, signal, noise, rate;
  let snr = false;
  let quality = false;

  try {
    res = execSync("/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I")
  } catch (e) {
    throw `SITH panicked: ${e}`
  }

  res = res.toString();

  try {
    signal = parseInt(res.match(/(?:agrCtlRSSI): *(-[\d]*)/)[1],10)
  } catch(e) {
    console.log(`could not parse signal data ${e}`)
    signal = false
  }

  try {
    rate = parseInt(res.match(/(?:lastTxRate): *([\d]*)/)[1],10)
  } catch(e) {
    console.log(`could not parse rate data ${e}`)
    rate = false
  }

  try {
    noise = parseInt(res.match(/(?:agrCtlNoise): *(-[\d]*)/)[1],10)
  } catch(e) {
    console.log(`could not parse noise data ${e}`)
    noise = false
  }

  if (signal && noise) {
    snr = signal - noise
  }

  if (signal) {
    quality = utils.dbmToQuality(signal)
  }


  return {signal, noise, rate, snr, quality}

}

module.exports = get_data_osx
