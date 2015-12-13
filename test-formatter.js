import test from 'ava';
import {
  signalLevelMarkers,
  MAX_SIGNAL,
  MIN_SIGNAL,
  snrMarkers,
  MAX_SNR,
  MIN_SNR
  } from './formatters'

test('signalLevelMarkers', t => {
    let res;

    res = signalLevelMarkers(MAX_SIGNAL)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(10)) >= 0, 'case: max signal');

    res = signalLevelMarkers(MAX_SIGNAL + 10)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(10)) >= 0, 'case: more than max signal');

    res = signalLevelMarkers(MIN_SIGNAL)
    t.ok(res.length === 10);
    t.ok(res.indexOf("-".repeat(10)) >= 0, 'case: min signal');

    res = signalLevelMarkers(MIN_SIGNAL -10)
    t.ok(res.length === 10);
    t.ok(res.indexOf("-".repeat(10)) >= 0, 'case: less than min signal');
});



test('snrMarkers', t => {
    let res;

    res = snrMarkers(MAX_SNR)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(10)) >= 0, 'case: max signal');

    res = snrMarkers(MAX_SNR + 10)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(10)) >= 0, 'case: more than max signal');

    res = snrMarkers(MIN_SNR)
    t.ok(res.length === 10);
    t.ok(res.indexOf("-".repeat(10)) >= 0, 'case: min signal');

    res = snrMarkers(MIN_SNR -10)
    t.ok(res.length === 10);
    t.ok(res.indexOf("-".repeat(10)) >= 0, 'case: less than min signal');
});

