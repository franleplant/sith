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
    //   noise: [Number|false],
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
      activity = !activity

      let signalPer = fmt.getPercentage(data.signal, -100, -50)
      let signalMarkers = fmt.getColor(signalPer)(fmt.getMarkers(signalPer))
      let snrPer = fmt.getPercentage(data.snr, 4, 25)
      let snrMarkers = fmt.getColor(snrPer)(fmt.getMarkers(snrPer))
      let qualityPer = fmt.getPercentage(data.quality)
      let qualityMarkers = fmt.getColor(qualityPer)(fmt.getMarkers(qualityPer))

      return `\

  ${activity ? chalk.magenta('W') : chalk.inverse(chalk.magenta('W'))}${chalk.magenta('SSA: Wifi Signal Strength Analyzer')}

                   Signal ${signalMarkers} ${data.signal} dBm
                  Quality ${qualityMarkers} ${data.quality} %
                      SNR ${snrMarkers} ${data.snr} dBm

  Detail
  ------
     Quality[%]: ${data.quality}
    Signal[dBm]: ${data.signal}
     Noise[dBm]: ${data.noise}
       SNR[dBm]: ${data.snr}
      Rate[Mbs]: ${chalk.inverse(data.rate)}



  Info
  ----
  SNR: Signal To noise Ratio (difference)
  SNR = S - N [dBm]

  Quality: Quality of the signal based on the power with which the signal is percived
  Quality = 2 * (Signal + 100)
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
