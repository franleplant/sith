'use strict'

let source_osx = require('./source_osx')



//TODO: document the format expected from the sources
    //this only supports OS X
    //   signal: [Number|false],
    //   noise: [Number|false],
    //   rate: [Number|false],
    //   snr: [Number|false]
    //   quality: [Number|false]
if (process.platform.indexOf('darwin') >= 0) {
  module.exports = source_osx;
} else {
  throw 'platform not supported'
}
