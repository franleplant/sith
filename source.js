'use strict'

let source_osx = require('./source_osx')
let source_linux = require('./source_linux')


let platform = process.platform

/**
 * @typedef signalData
 * @prop {Number} signal - negative [dBm]
 * @prop {Number} noice - negative [dBm]
 * @prop {Number} quality - [%]
 * @prop {Number} rate - [Mbs] current transimition rate
 * @prop {Number} snr - positive [dBm]
 *
 */

/**
 * source_{platform}: _ => signalData
 */

if (platform.indexOf('darwin') >= 0) {
  module.exports = source_osx;
} else if (platform.indexOf('linux') >= 0) {
  module.exports = source_linux;
} else {
  throw 'SITH Panicked! platform not supported'
}
