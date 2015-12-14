'use strict';

let chalk = require('chalk')
let rx = require('rx')
let logUpdate = require('log-update')
let source = require('./source')
let fmt = require('./formatters')
// https://support.metageek.com/hc/en-us/articles/201955754-Acceptable-Wi-Fi-Signal-Strengths
//https://support.bluesound.com/hc/en-us/articles/201940663-What-should-my-Wireless-Signal-Strength-be-for-best-performance-
//http://www.watchguard.com/help/docs/wsm/xtm_11/en-US/index.html#cshid=en-US/wireless/ap_wireless_signalstrength_c.html
//SNR
//http://www.enterprisenetworkingplanet.com/netsp/article.php/3747656/WiFi-Define-Minimum-SNR-Values-for-Signal-Coverage.htm
//

// Render in a cleared screen
process.stdout.cursorTo(0, 0);
process.stdout.clearScreenDown()

/**
 * @param {Boolean} useSignal - use signal power instead of snr as a quality source
 * @param {Boolean} singleRun - run only once
 */
function sith() {
  let activity = false;

  rx.Observable.timer(0, 1000)
    .timeInterval()
    .map(_ => source())
    .map(data => {
      activity = !activity

      let signalPer = fmt.getPercentage(data.signal, -100, -50)
      let signalMarkers = fmt.getColor(signalPer)(fmt.getMarkers(signalPer))
      let snrPer = fmt.getPercentage(data.snr, 4, 25)
      let snrMarkers = fmt.getColor(snrPer)(fmt.getMarkers(snrPer))
      let qualityPer = fmt.getPercentage(data.quality)
      let qualityMarkers = fmt.getColor(qualityPer)(fmt.getMarkers(qualityPer))

      let title = 'SITH: Wifi Signal Strength Analyzer'

      function aniTitle(title, n) {
        // TODO: when abstracting this, activity should be a clojure value for this func
        //let f = title.slice(0,1)
        let f = chalk.magenta(title.slice(0,n))
        let t = chalk.magenta(title.slice(n))
        f = activity ? chalk.inverse(f) : f;
        return f + t;
      }

      return `\

  ${aniTitle(title, 4)}

                   Signal ${signalMarkers} ${data.signal || 'no data'} dBm
                  Quality ${qualityMarkers} ${data.quality || 'no data'} %
                      SNR ${snrMarkers} ${data.snr || 'no data'} dBm

  Detail
  ------
     Quality[%]: ${data.quality || 'no data'}
    Signal[dBm]: ${data.signal || 'no data'}
     Noise[dBm]: ${data.noise || 'no data'}
       SNR[dBm]: ${data.snr || 'no data'}
      Rate[Mbs]: ${chalk.inverse(data.rate || 'no data')}



  Info
  ----
  SNR: Signal To noise Ratio (difference)
  SNR = S - N [dBm]

  Quality: Quality of the signal based on the power with which the signal is percived
  Quality = 2 * (Signal + 100)
      `
    })
    .map(x => {
      //process.stdout.cursorTo(0, 0);
      //process.stdout.clearScreenDown()
      //console.log(x)
      logUpdate(x)
    })
    .subscribe(
      x => {},
      e => console.log('Something went wrong!', e)
    )
}


sith()
module.exports = sith
