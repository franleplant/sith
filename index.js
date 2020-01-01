const source_osx = require('./source/osx')
const source_linux = require('./source/linux')
const platform = process.platform


//TODO
//let each source return an object of sources per device
// {deviceID: {data}}
//Let each source throw errors if they fail and let index.js or cli.js panic correctly

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
