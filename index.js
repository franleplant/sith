'use strict';

let chalk = require('chalk')
let rx = require('rx')
let sourceOSX$ = require('./OSX_source')
let fmt = require('./formatters')
// https://support.metageek.com/hc/en-us/articles/201955754-Acceptable-Wi-Fi-Signal-Strengths
//https://support.bluesound.com/hc/en-us/articles/201940663-What-should-my-Wireless-Signal-Strength-be-for-best-performance-
//http://www.watchguard.com/help/docs/wsm/xtm_11/en-US/index.html#cshid=en-US/wireless/ap_wireless_signalstrength_c.html
//SNR
//http://www.enterprisenetworkingplanet.com/netsp/article.php/3747656/WiFi-Define-Minimum-SNR-Values-for-Signal-Coverage.htm
//


/**
 * @param {Boolean} useSignal - use signal power instead of snr as a quality source
 * @param {Boolean} singleRun - run only once
 */
function wssa() {
  let source;
  if (process.platform.indexOf('darwin') >= 0) {
    //this only supports OS X
    // source: _ => Observable({
    //   signal: [Number|false],
    //   noice: [Number|false],
    //   rate: [Number|false],
    //   snr: [Number|false]
    //  })
    source = sourceOSX$;
  } else {
    console.log('platform not supported')
    return
  }


  let activity = false;

  rx.Observable.timer(0, 1000)
    .timeInterval()
    .flatMapObserver(_ => source())
    .map(data => {
      //TODO: replace signal for snr and fall back to signal when no snr is present
      //probably would want to make an abstraction like this
      // signal|snr => qualifier
      // levelColor(qualifier)
      // leveldescription(qualifier)
      // levelStatus(qualifier)
      //
      activity = !activity
      let marker;
      if (data.snr) {
        marker = fmt.snrMarkers(data.snr)
      } else {
        marker = fmt.signalLevelMarkers(data.signal)
      }

      let desc
      if (data.snr) {
        desc = fmt.snrColor(data.snr)(fmt.snrDescription(data.snr));
      } else {
        desc = fmt.signalLevelColor(data.signal)(fmt.signalLevelDescription(data.signal));
      }

      return `\

  ${chalk.magenta('WSSA: Wifi Signal Strength Analyzer')}

  ${activity ? ' ' : chalk.bgWhite(' ')}Polling...

  ${chalk.green(marker)}     ${desc}

  Status: ${fmt.signalLevelStatus(data.signal)}

  Signal[dBm]: ${data.signal || 'no data'}
   Noice[dBm]: ${data.noice || 'no data'}
     SNR[dBm]: ${data.snr || 'no data'}
    Rate[Mbs]: ${data.rate || 'no data'}


  Info
  ----
  -67 dBm Minimum signal strength for applications that require very reliable, timely packet delivery.  VoIP/VoWiFi, streaming video
  -70 dBm Minimum signal strength for reliable packet delivery. Email, web
  SNR = S - N [dBm]
      `
    })
    .map(x => {
      process.stdout.cursorTo(0, 0);
      process.stdout.clearScreenDown()
      console.log(x)
    })
    .subscribe(
      x => {},
      e => console.log('Something went wrong!', e)
    )
}


wssa()
module.exports = wssa
