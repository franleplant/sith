'use strict';
let rx = require('rx')
var exec = require('child_process').exec

let exec$ = rx.Observable.fromNodeCallback(exec);

module.exports = function sourceOSX() {
  return exec$("/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I")
    .map(stdout_err  => {
        let stdout = stdout_err[0]
        let stderr = stdout_err[1]
        //console.log('stdout', stdout)
        //console.log('stderr', stderr)
        if (stderr) {
          console.log(`something went into the stderr ${stderr}`)
        }


        let signal;
        try {
          signal = parseInt(stdout.match(/(?:agrCtlRSSI): *(-[\d]*)/)[1],10)
        } catch(e) {
          console.log(`could not parse signal data ${e}`)
          signal = false
        }

        let rate;
        try {
          rate = parseInt(stdout.match(/(?:lastTxRate): *([\d]*)/)[1],10)
        } catch(e) {
          console.log(`could not parse rate data ${e}`)
          rate = false
        }

        let noice;
        try {
          noice = parseInt(stdout.match(/(?:agrCtlNoise): *(-[\d]*)/)[1],10)
        } catch(e) {
          console.log(`could not parse noice data ${e}`)
          noice = false
        }

        let snr;
        if (signal && noice) {
          snr = signal - noice
        } else {
          snr = false
        }

        return {signal, noice, rate, snr}
    })

}
