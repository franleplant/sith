'use strict';

let chalk = require('chalk')
let rx = require('rx')
// https://support.metageek.com/hc/en-us/articles/201955754-Acceptable-Wi-Fi-Signal-Strengths
//https://support.bluesound.com/hc/en-us/articles/201940663-What-should-my-Wireless-Signal-Strength-be-for-best-performance-
//http://www.watchguard.com/help/docs/wsm/xtm_11/en-US/index.html#cshid=en-US/wireless/ap_wireless_signalstrength_c.html
//SNR
//http://www.enterprisenetworkingplanet.com/netsp/article.php/3747656/WiFi-Define-Minimum-SNR-Values-for-Signal-Coverage.htm



var exec = require('child_process').exec
let exec$ = rx.Observable.fromNodeCallback(exec);
var sourceOSX$ =
  rx.Observable.timer(0, 1000)
  .timeInterval()
  .flatMapObserver(_ => exec$("/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I"))
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
        signal = 'no data'
      }

      let rate;
      try {
        rate = parseInt(stdout.match(/(?:lastTxRate): *([\d]*)/)[1],10)
      } catch(e) {
        console.log(`could not parse rate data ${e}`)
        rate = 'no data'
      }

      let noice;
      try {
        noice = parseInt(stdout.match(/(?:agrCtlNoise): *(-[\d]*)/)[1],10)
      } catch(e) {
        console.log(`could not parse noice data ${e}`)
        noice = 'no data'
      }

      return {signal, noice, rate}
  })

// level should be a negative number
// TODO: unit test and fine tune
const MAX_SIGNAL = -35
const MIN_SIGNAL = -90
let range = Math.abs(MAX_SIGNAL - MIN_SIGNAL)
function getSignalLevelMarkers(level) {
  if (level > MAX_SIGNAL) level = MAX_SIGNAL
  if (level < MIN_SIGNAL) level = MIN_SIGNAL

  let pp = (range - (-level - 30)) / range
  let p = Math.round(pp * 10)
  //let p = Math.round((100 + level + 30)/10);
  var q = 10 - p;
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


let source$;
if (process.platform.indexOf('darwin') >= 0) {
  //this only supports OS X
  source$ = sourceOSX$;
} else {
  //TODO: process exit
  console.log('platform not supported')
  return
}

let activity = false;
source$
  .map(data => {

    activity = !activity

    return `\
  Wifi signal strength analyzer

  Measuring ${activity ? '.' : ''}
  ${chalk.green(getSignalLevelMarkers(data.signal))}      ${signalLevelColor(data.signal)(signalLevelDescription(data.signal))}

  Status: ${signalLevelStatus(data.signal)}

  Signal[dBm]: ${data.signal}
   Noice[dBm]: ${data.noice}
     SNR[dBm]: ${data.signal - data.noice}
    Rate[Mbs]: ${data.rate}


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
