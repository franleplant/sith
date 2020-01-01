'use strict';
let execSync = require('child_process').execSync
let utils = require('./utils')


function get_data_linux() {
  let res, signal, noise, rate;
  let snr = false;
  let quality = false;

  try {
    res = execSync("cat /proc/net/wireless")
  } catch (e) {
    throw `SITH panicked: ${e}`
  }


  try {
    // Redirect stderr to avoid useless printing to terminal
    rate = execSync("iwconfig 2> /dev/null")

  } catch (e) {
    throw `SITH panicked: ${e}`
  }

  res = res.toString();

  try {
    res = res.split('\n')[2].split(/\s+/)
    signal = parseInt(res[3], 10)
    noise  = parseInt(res[4], 10)
  } catch (e) {
    throw `SITH panicked! could not parse signal or noice data ${e}`
  }

  rate = rate.toString()

  try {
    rate = parseInt(rate.match(/(?:Bit Rate=)([\d]*)/)[1],10)
  } catch(e) {
    throw `SITH panicked! could not parse rate data ${e}`
  }


  snr = signal - noise

  quality = utils.dbmToQuality(signal)


  return {signal, noise, rate, snr, quality}
}

module.exports = get_data_linux
