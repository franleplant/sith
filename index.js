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
  ${chalk.green(fmt.signalLevelMarkers(data.signal))}      ${fmt.signalLevelColor(data.signal)(fmt.signalLevelDescription(data.signal))}

  Status: ${fmt.signalLevelStatus(data.signal)}

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
