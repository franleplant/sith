<h1 align="center">
  <img width="300" src="https://rawgit.com/franleplant/sith-cli/master/sith_logo.png" alt="SITH">
  </br>
  </br>  
  SITH
</h1>

> SITH is a Wifi Signal Strength Analyzer CLI app and API

Wrap OS specific commands and provide a unified way of displaying Wifi Signal data.

Use it as a diagnostic tool for your network.



## Intro

```sh
# Install
npm install -g sith

# Run it!
sith
```


Or use the API

```javascript

import sith from 'sith';


sith() // => {signal, noise, snr, rate, quality}
```


## Road Map

- Support Windows
- Support multiple active wifi devices in the same computer
- Enable the user to select the device she wants to monitor
- Improve docs
- Release 1.0



